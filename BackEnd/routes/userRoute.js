import express from "express";
import {
  adminLogin,
  loginUser,
  registerUser,
  resetPassword,
  sendResetOtp,
} from "../controller/userController.js";
import {
  adminLoginLimiter,
  loginLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
  registerLimiter,
} from "../middleware/rateLimit.js";

const userRouter = express.Router();

userRouter.post("/register", registerLimiter, registerUser);
userRouter.post("/login", loginLimiter, loginUser);
userRouter.post("/admin", adminLoginLimiter, adminLogin);
userRouter.post("/send-reset-otp", otpRequestLimiter, sendResetOtp);
userRouter.post("/reset-password", otpVerifyLimiter, resetPassword);

export default userRouter;
