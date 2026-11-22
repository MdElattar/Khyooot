import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const ISSUER = "khyoot-api";
const AUDIENCE = "khyoot-client";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT signing secret is not configured");
  }
  return secret;
};

const baseOptions = {
  algorithm: "HS256",
  issuer: ISSUER,
  audience: AUDIENCE,
};

export const signUserToken = (user) =>
  jwt.sign(
    {
      id: String(user._id),
      role: "user",
      ver: Number(user.tokenVersion) || 0,
    },
    getSecret(),
    {
      ...baseOptions,
      expiresIn: process.env.USER_TOKEN_TTL || "7d",
      jwtid: crypto.randomUUID(),
    }
  );

export const signAdminToken = (subject) =>
  jwt.sign(
    { role: "admin", sub: String(subject) },
    getSecret(),
    {
      ...baseOptions,
      expiresIn: process.env.ADMIN_TOKEN_TTL || "12h",
      jwtid: crypto.randomUUID(),
    }
  );

export const verifyToken = (token) =>
  jwt.verify(token, getSecret(), {
    algorithms: ["HS256"],
    issuer: ISSUER,
    audience: AUDIENCE,
  });

export const extractBearerToken = (value) => {
  if (typeof value !== "string") return null;
  const match = value.match(/^Bearer\s+(\S+)$/i);
  return match ? match[1] : value.trim() || null;
};
