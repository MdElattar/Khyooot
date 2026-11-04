import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place order
const PlaceOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: paymentMethod || "COD",
      payment: false,
      date: Date.now(),
      statusHistory: [{ status: "Order Placed", date: Date.now() }]
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await cartModel.findOneAndDelete({ userId });
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed Successfully" });
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

// Update order status with statusHistory timeline tracking
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // إضافة الحالة الجديدة مع التوقيت الحالي لـ Timeline
    const updatedHistory = order.statusHistory || [];
    // منع التكرار إذا كانت نفس الحالة
    if (!updatedHistory.some(item => item.status === status)) {
      updatedHistory.push({ status, date: Date.now() });
    }

    await orderModel.findByIdAndUpdate(orderId, { 
      status, 
      statusHistory: updatedHistory 
    });

    res.json({ success: true, message: "Status Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { PlaceOrder, allOrders, userOrders, updateStatus };