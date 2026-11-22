import crypto from "node:crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import userModel from "../models/userModel.js";
import { BCRYPT_ROUNDS, generateOtp, hashOtp, hashPassword, safeEqual, verifyOtp, verifyPassword } from "../utils/crypto.js";
import { buildOtpEmail } from "../utils/emailTemplate.js";
import { fail } from "../utils/http.js";
import { logInfo, logSecurity } from "../utils/logger.js";
import { signAdminToken, signUserToken } from "../utils/tokens.js";
import { readEmail, readOtp, readPassword, readText } from "../utils/validation.js";

const OTP_TTL_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
// Random dummy hash generated at startup (never a credential) for timing equalization.
const DUMMY_HASH = bcrypt.hashSync(crypto.randomBytes(32).toString("hex"), BCRYPT_ROUNDS);
const generateNumericOtp = generateOtp;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

// Route for user login
const loginUser = async (req, res) => {
  try {
    const email = readEmail(req.body?.email);
    const password = readPassword(req.body?.password);

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      // Equalize timing so absent accounts are not trivially distinguishable.
      await verifyPassword(password, "$2b$12$C6UzMDM.H6dfI/f/IKcEe.5Y7Z8nQ9x9HkPZQy1H2s6VJ0u5y1ZqK");
      logSecurity("login_failed", { reason: "account_not_found" });
      return fail(res, 401, "Invalid email or password");
    }

    if (!(await verifyPassword(password, user.password))) {
      logSecurity("login_failed", { reason: "bad_password" });
      return fail(res, 401, "Invalid email or password");
    }

    return res.json({ success: true, token: signUserToken(user) });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    logSecurity("login_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const name = readText(req.body?.name, "name", { max: 80 });
    const email = readEmail(req.body?.email);
    const password = readPassword(req.body?.password);

    const exists = await userModel.findOne({ email });
    if (exists) return fail(res, 409, "User already exists");

    const user = await userModel.create({
      name,
      email,
      password: await hashPassword(password),
      tokenVersion: 0,
    });

    logInfo("user_registered");
    return res.json({ success: true, token: signUserToken(user) });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    if (error?.code === 11000) return fail(res, 409, "User already exists");
    logSecurity("register_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// Route for admin login. A signed role-bearing token replaces the old
// email+password string; the legacy string is never accepted by adminAuth.
const adminLogin = async (req, res) => {
  try {
    const email = readText(req.body?.email, "email", { max: 254 });
    const password = readText(req.body?.password, "password", { min: 1, max: 128 });

    const configuredEmail = process.env.ADMIN_EMAIL || "";
    const hash = process.env.ADMIN_PASSWORD_HASH;
    const matchesEmail = safeEqual(email, configuredEmail);
    const matchesPassword = hash
      ? await verifyPassword(password, hash)
      : safeEqual(password, process.env.ADMIN_PASSWORD || "");

    if (!matchesEmail || !matchesPassword) {
      logSecurity("admin_login_failed");
      return fail(res, 401, "Invalid credentials");
    }

    logInfo("admin_login_success");
    return res.json({ success: true, token: signAdminToken(configuredEmail) });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    logSecurity("admin_login_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// Send a single-use, short-lived reset code. The response is identical whether
// or not the account exists, so accounts cannot be enumerated.
const sendResetOtp = async (req, res) => {
  try {
    const email = readEmail(req.body?.email);
    const user = await userModel.findOne({ email });

    if (user) {
      const otp = generateNumericOtp();
      user.resetOtp = await hashOtp(otp);
      user.resetOtpExpireAt = Date.now() + OTP_TTL_MS;
      user.resetOtpAttempts = 0;
      await user.save();

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "KHYOOT - Password Reset Code",
        html: buildOtpEmail(otp),
      });
      logInfo("reset_otp_sent");
    } else {
      logInfo("reset_otp_request_unknown_account");
    }

    return res.json({
      success: true,
      message: "If the account exists, a verification code has been sent",
    });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    logSecurity("reset_otp_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// Reset password using a hashed, single-use, short-lived OTP.
const resetPassword = async (req, res) => {
  try {
    const email = readEmail(req.body?.email);
    const otp = readOtp(req.body?.otp);
    const newPassword = readPassword(req.body?.newPassword);

    const user = await userModel
      .findOne({ email })
      .select("+resetOtp +resetOtpExpireAt +resetOtpAttempts");
    const invalid = () => fail(res, 400, "Invalid or expired verification code");

    if (!user || !user.resetOtp || !user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
      if (user && user.resetOtp) {
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        user.resetOtpAttempts = 0;
        await user.save();
      }
      logSecurity("reset_otp_rejected", { reason: "expired_or_missing" });
      return invalid();
    }

    if (user.resetOtpAttempts >= MAX_OTP_ATTEMPTS) {
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;
      user.resetOtpAttempts = 0;
      await user.save();
      logSecurity("reset_otp_rejected", { reason: "attempt_limit" });
      return invalid();
    }

    if (!(await verifyOtp(otp, user.resetOtp))) {
      user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
      if (user.resetOtpAttempts >= MAX_OTP_ATTEMPTS) {
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        user.resetOtpAttempts = 0;
      }
      await user.save();
      logSecurity("reset_otp_rejected", { reason: "bad_code" });
      return invalid();
    }

    user.password = await hashPassword(newPassword);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    user.resetOtpAttempts = 0;
    // Invalidate every previously issued session after a password change.
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    logInfo("password_reset_success");
    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    logSecurity("reset_password_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

export { loginUser, registerUser, adminLogin, sendResetOtp, resetPassword };
