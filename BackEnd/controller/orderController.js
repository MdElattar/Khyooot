import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import { fail } from "../utils/http.js";
import { uploadImageBuffer } from "../utils/imageUpload.js";
import { logInfo, logSecurity } from "../utils/logger.js";
import { buildPricedOrder } from "../utils/orderPricing.js";
import { readAddress, readObjectId, readPaymentMethod, readStatus } from "../utils/validation.js";

const parseLimit = (value) => {
  const limit = Number(value);
  return Number.isInteger(limit) && limit > 0 ? Math.min(limit, 1000) : 500;
};

// Place order: totals and line items are rebuilt from the server-side cart.
const PlaceOrder = async (req, res) => {
  const appliedStockChanges = [];
  try {
    const userId = String(req.user?._id || "");
    if (!/^[a-f\d]{24}$/i.test(userId)) return fail(res, 401, "Authentication required");

    const address = readAddress(req.body?.address);
    const paymentMethod = readPaymentMethod(req.body?.paymentMethod);

    const cart = await cartModel.findOne({ userId });
    if (!cart?.items?.length) return fail(res, 400, "Your cart is empty");

    const productIds = cart.items.map((item) => item.productId);
    const products = await productModel.find({ _id: { $in: productIds } });
    const priced = buildPricedOrder({ cart, products });

    // Decrement stock atomically; abort before saving the order if stock changed.
    for (const item of priced.items) {
      const product = products.find((p) => String(p._id) === item.productId);
      const hasSizeStock = product?.sizesStock && Object.prototype.hasOwnProperty.call(product.sizesStock, item.size);
      if (!hasSizeStock || !/^[A-Za-z0-9_-]+$/.test(item.size)) continue;

      const result = await productModel.updateOne(
        {
          _id: item.productId,
          [`sizesStock.${item.size}`]: { $gte: item.quantity },
          stock: { $gte: item.quantity },
        },
        {
          $inc: { [`sizesStock.${item.size}`]: -item.quantity, stock: -item.quantity },
        }
      );
      if (result.matchedCount !== 1) throw new Error("STOCK_CONFLICT");
      appliedStockChanges.push({ productId: item.productId, size: item.size, quantity: item.quantity });
    }

    let paymentProof;
    if (req.file) {
      const uploaded = await uploadImageBuffer(req.file, "khyoot/payment-proofs");
      paymentProof = { url: uploaded.url, publicId: uploaded.publicId };
    }

    const order = await orderModel.create({
      userId,
      items: priced.items,
      address,
      amount: priced.amount,
      paymentMethod,
      paymentProof: paymentProof?.url,
      paymentProofPublicId: paymentProof?.publicId,
      // Payment is never set from client input. It changes only after verification.
      payment: false,
      date: Date.now(),
      statusHistory: [{ status: "Order Placed", date: Date.now() }],
    });

    await cartModel.deleteOne({ userId });
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    logInfo("order_created", { orderId: String(order._id), amount: priced.amount });
    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    // Compensating rollback: a later item/upload/order failure must not leave
    // earlier stock decrements applied. MongoDB transactions are preferred for
    // multi-instance production deployments (see final report).
    for (const change of appliedStockChanges.reverse()) {
      try {
        await productModel.updateOne(
          { _id: change.productId },
          {
            $inc: {
              [`sizesStock.${change.size}`]: change.quantity,
              stock: change.quantity,
            },
          }
        );
      } catch (rollbackError) {
        logSecurity("order_stock_rollback_failed", { name: rollbackError?.name });
      }
    }

    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    if (error?.message === "STOCK_CONFLICT") {
      return fail(res, 409, "Stock changed while placing your order. Please review your cart.");
    }
    logSecurity("order_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// All orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const limit = parseLimit(req.query?.limit || req.body?.limit);
    const orders = await orderModel.find({}).sort({ date: -1 }).limit(limit);
    return res.json({ success: true, orders });
  } catch (error) {
    logSecurity("order_list_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// User order data for the authenticated user only
const userOrders = async (req, res) => {
  try {
    const userId = String(req.user?._id || "");
    if (!/^[a-f\d]{24}$/i.test(userId)) return fail(res, 401, "Authentication required");
    const orders = await orderModel.find({ userId }).sort({ date: -1 }).limit(100);
    return res.json({ success: true, orders });
  } catch (error) {
    logSecurity("user_orders_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// Update order status with statusHistory timeline tracking
const updateStatus = async (req, res) => {
  try {
    const orderId = readObjectId(req.body?.orderId);
    const status = readStatus(req.body?.status);

    const order = await orderModel.findById(orderId);
    if (!order) return fail(res, 404, "Order not found");

    const history = Array.isArray(order.statusHistory) ? [...order.statusHistory] : [];
    const lastStatus = history[history.length - 1]?.status;
    if (lastStatus !== status) history.push({ status, date: Date.now() });

    await orderModel.findByIdAndUpdate(
      orderId,
      { status, statusHistory: history },
      { runValidators: true }
    );
    logInfo("order_status_updated", { orderId, status });
    return res.json({ success: true, message: "Status Updated Successfully" });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    logSecurity("order_status_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// Manual confirmation of an InstaPay transfer after out-of-band bank verification.
const verifyPayment = async (req, res) => {
  try {
    const orderId = readObjectId(req.body?.orderId);
    const order = await orderModel.findById(orderId);
    if (!order) return fail(res, 404, "Order not found");
    if (order.paymentMethod !== "InstaPay") {
      return fail(res, 400, "Only InstaPay orders can be confirmed here");
    }
    if (order.payment) return fail(res, 409, "Payment already confirmed");

    await orderModel.findByIdAndUpdate(
      orderId,
      { payment: true, paymentVerifiedAt: Date.now() },
      { runValidators: true }
    );
    logInfo("payment_verified", { orderId });
    return res.json({ success: true, message: "Payment confirmed" });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    logSecurity("payment_verify_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

export { PlaceOrder, allOrders, userOrders, updateStatus, verifyPayment };
