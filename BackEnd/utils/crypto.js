import crypto from "node:crypto";
import bcrypt from "bcrypt";

const configuredRounds = Number(process.env.BCRYPT_ROUNDS || 12);
export const BCRYPT_ROUNDS = Number.isInteger(configuredRounds)
  ? Math.min(15, Math.max(10, configuredRounds))
  : 12;

export const hashPassword = (password) => bcrypt.hash(password, BCRYPT_ROUNDS);
export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

export const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

export const hashOtp = (otp) => bcrypt.hash(otp, BCRYPT_ROUNDS);
export const verifyOtp = (otp, hash) => bcrypt.compare(otp, hash);

// Constant-time comparison for the legacy admin password fallback.
export const safeEqual = (left, right) => {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
