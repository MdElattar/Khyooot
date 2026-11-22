import mongoose from "mongoose";
import "../config/mongoose.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, trim: true, maxlength: 254 },
  password: { type: String, required: true, select: false },
  cartData: { type: Object, default: {} },
  tokenVersion: { type: Number, default: 0, min: 0 },
  resetOtp: { type: String, default: "", select: false },
  resetOtpExpireAt: { type: Number, default: 0 },
  resetOtpAttempts: { type: Number, default: 0, min: 0 },
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
