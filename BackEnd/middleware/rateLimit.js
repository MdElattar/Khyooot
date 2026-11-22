import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import crypto from "node:crypto";
import { fail } from "../utils/http.js";
import { logSecurity } from "../utils/logger.js";

const numberFromEnv = (key, fallback) => {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
};

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const keyFor = (includeEmail) => (req) => {
  const ip = ipKeyGenerator(req.ip || req.socket?.remoteAddress || "unknown");
  if (!includeEmail) return ip;
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const fingerprint = email ? crypto.createHash("sha256").update(email).digest("hex").slice(0, 16) : "-";
  return `${ip}:${fingerprint}`;
};

const createLimiter = ({ name, windowMs, limit, includeEmail = false, skipSuccessfulRequests = false }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests,
    keyGenerator: keyFor(includeEmail),
    handler: (req, res) => {
      logSecurity("rate_limit_exceeded", { name, method: req.method, path: req.path });
      fail(res, 429, "Too many requests, please try again later");
    },
  });

export const globalLimiter = createLimiter({
  name: "global",
  windowMs: FIFTEEN_MINUTES,
  limit: numberFromEnv("GLOBAL_RATE_LIMIT", 300),
});

export const loginLimiter = createLimiter({
  name: "login",
  windowMs: FIFTEEN_MINUTES,
  limit: numberFromEnv("LOGIN_RATE_LIMIT", 10),
  includeEmail: true,
  skipSuccessfulRequests: true,
});

export const adminLoginLimiter = createLimiter({
  name: "admin_login",
  windowMs: FIFTEEN_MINUTES,
  limit: numberFromEnv("ADMIN_LOGIN_RATE_LIMIT", 10),
  includeEmail: true,
  skipSuccessfulRequests: true,
});

export const registerLimiter = createLimiter({
  name: "register",
  windowMs: 60 * 60 * 1000,
  limit: numberFromEnv("REGISTER_RATE_LIMIT", 5),
  includeEmail: true,
});

export const otpRequestLimiter = createLimiter({
  name: "otp_request",
  windowMs: 60 * 60 * 1000,
  limit: numberFromEnv("OTP_REQUEST_RATE_LIMIT", 3),
  includeEmail: true,
});

export const otpVerifyLimiter = createLimiter({
  name: "otp_verify",
  windowMs: FIFTEEN_MINUTES,
  limit: numberFromEnv("OTP_VERIFY_RATE_LIMIT", 10),
  includeEmail: true,
});

export const cartLimiter = createLimiter({
  name: "cart",
  windowMs: FIFTEEN_MINUTES,
  limit: numberFromEnv("CART_RATE_LIMIT", 120),
});

export const orderLimiter = createLimiter({
  name: "order",
  windowMs: 60 * 60 * 1000,
  limit: numberFromEnv("ORDER_RATE_LIMIT", 20),
});
