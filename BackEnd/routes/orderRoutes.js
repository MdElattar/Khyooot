import express from "express";
import { allOrders, PlaceOrder, updateStatus, userOrders, verifyPayment } from "../controller/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/authUser.js";
import { orderLimiter } from "../middleware/rateLimit.js";
import { uploadReceipt } from "../middleware/multer.js";

const orderRouter = express.Router();

// Admin features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/verify-payment", adminAuth, verifyPayment);

// Customer features
orderRouter.post("/place", authUser, orderLimiter, uploadReceipt, PlaceOrder);
// Kept for backwards compatibility with the existing frontend route name.
orderRouter.post("/instapay", authUser, orderLimiter, uploadReceipt, PlaceOrder);
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
