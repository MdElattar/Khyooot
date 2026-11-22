import mongoose from "mongoose";
import "../config/mongoose.js";

const ORDER_STATUSES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Canceled",
];

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true, min: 0 },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed", enum: ORDER_STATUSES },
  paymentMethod: { type: String, required: true, enum: ["Cash on Delivery", "InstaPay"] },
  payment: { type: Boolean, required: true, default: false },
  paymentVerifiedAt: { type: Number, default: 0 },
  paymentProof: { type: String, default: "" },
  paymentProofPublicId: { type: String, default: "" },
  date: { type: Number, required: true },
  statusHistory: {
    type: Array,
    default: () => [{ status: "Order Placed", date: Date.now() }],
  },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
