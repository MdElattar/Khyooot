import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place order
const PlaceOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body; // <-- ضفنا paymentMethod هنا

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: paymentMethod || "COD", // <-- بنستقبلها من الفرونت إند، ولو مش موجودة يحط COD كاحتياط
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // FIX: Delete the actual cart document from the separate collection
    await cartModel.findOneAndDelete({ userId });

    // Clear the userModel reference as well for redundancy
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data For Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error); // تم تصحيح خطأ الإملاء هنا برضوا (conso.lpg -> console.log)
    res.json({ success: false, message: error.message });
  }
};

export { PlaceOrder, allOrders, userOrders, updateStatus };