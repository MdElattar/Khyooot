import express from "express";
import { adminLogin, loginUser, registerUser, resetPassword, sendResetOtp } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post('/send-reset-otp', sendResetOtp);
userRouter.post('/reset-password', resetPassword);


export default userRouter;
