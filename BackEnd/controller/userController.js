import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// إعداد Nodemailer لإرسال الإيميلات
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL, // إيميلك المرسل
    pass: process.env.SENDER_EMAIL_PASSWORD, // كلمة سر التطبيقات (App Password) من جوجل
  },
});

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User doesn't exists",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invaild credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checking user already exist or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hashing user passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // إرسال توكن مباشر عبارة عن دمج الإيميل والباسورد
      const token = email + password;
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 1. Route to send Reset OTP to user email (Valid for 60 seconds)
const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // توليد كود عشوائي من 6 أرقام
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 1 * 60 * 1000; // صلاحية الكود دقيقة واحدة فقط (60 ثانية)
    await user.save();

    // قالب الإيميل الاحترافي الخاص بـ KHYOOT (مع تحديث النص إلى 60 ثانية)
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KHYOOT Security Verification</title>
        <style>
            @keyframes pulseGlow {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 52, 89, 0.4); }
                70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(0, 52, 89, 0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 52, 89, 0); }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .otp-box {
                animation: pulseGlow 2s infinite, fadeIn 0.8s ease-out;
            }
            .fade-in-text {
                animation: fadeIn 1s ease-out;
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f4f6f8; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
                        
                        <!-- Header Section with Brand Logo & Thread Icon -->
                        <tr>
                            <td align="center" style="background-color: #0b0b0b; padding: 40px 20px;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding-bottom: 10px;">
                                            <!-- Thread / Needle Luxury Icon -->
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M2 12h20M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5"/>
                                            </svg>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: 6px; margin: 0; text-transform: uppercase;">KHYOOT</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding-top: 8px;">
                                            <p style="color: #888888; font-size: 11px; letter-spacing: 3px; margin: 0; text-transform: uppercase;">Luxury Fashion & Tailoring</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Decorative Thread Line -->
                        <tr>
                            <td style="background: linear-gradient(90deg, #003459, #b8860b, #003459); height: 3px; font-size: 0; line-height: 0;">&nbsp;</td>
                        </tr>

                        <!-- Body Content -->
                        <tr>
                            <td class="fade-in-text" style="padding: 40px 40px 20px 40px;">
                                <h2 style="color: #111111; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 15px; text-align: center;">Security Verification Code</h2>
                                <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
                                    You have requested to reset your password or access your <b>KHYOOT</b> account. Please use the secure verification code below to proceed.
                                </p>

                                <!-- OTP Code Box with Animation -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 10px 0 25px 0;">
                                            <div class="otp-box" style="background-color: #f8fafc; border: 2px dashed #003459; border-radius: 12px; padding: 20px; display: inline-block; width: 260px;">
                                                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #003459; display: block; text-align: center;">${otp}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Warning Box: 60 Seconds Expiration -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff9e6; border-left: 4px solid #b8860b; border-radius: 0 8px 8px 0; margin-bottom: 25px;">
                                    <tr>
                                        <td style="padding: 15px 20px;">
                                            <p style="color: #856404; font-size: 13px; line-height: 1.5; margin: 0; font-weight: 500;">
                                                ⚠️ <b>Security Notice:</b> This verification code is valid for <b>60 seconds only</b>. Do not share this code with anyone for your account safety.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #777777; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                                    If you did not request this code, please ignore this email or contact our support team immediately. Your account security is our top priority.
                                </p>
                            </td>
                        </tr>

                        <!-- Divider -->
                        <tr>
                            <td style="padding: 0 40px;">
                                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 0;" />
                            </td>
                        </tr>

                        <!-- Footer Section -->
                        <tr>
                            <td align="center" style="padding: 30px 40px; background-color: #ffffff;">
                                <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0 0 10px 0;">
                                    &copy; 2026 <b>KHYOOT</b>. All rights reserved.<br>
                                    Crafted with precision and elegance.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "KHYOOT - Password Reset Code ",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "Reset OTP sent to your email" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// 2. Route to reset password using OTP
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    if (newPassword.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password (at least 8 characters)" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, sendResetOtp, resetPassword };