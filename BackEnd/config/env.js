// Environment validation. Values are never logged or returned to clients.
const REQUIRED_IN_PRODUCTION = [
  "MONGODB_URI",
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "CORS_ORIGINS",
];

const ADMIN_CREDENTIAL_KEYS = ["ADMIN_PASSWORD_HASH", "ADMIN_PASSWORD"];

export const validateEnvironment = () => {
  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);

  if (!ADMIN_CREDENTIAL_KEYS.some((key) => Boolean(process.env[key]))) {
    missing.push("ADMIN_PASSWORD_HASH or ADMIN_PASSWORD");
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return true;
};

export const getAllowedOrigins = () =>
  (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
