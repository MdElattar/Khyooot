import validator from "validator";
import mongoose from "../config/mongoose.js";

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.publicMessage = message;
  }
}

const fail = (message) => {
  throw new ValidationError(message);
};

export const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const hasControlCharacters = (value) => /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);

export const readText = (value, label, { min = 1, max = 120 } = {}) => {
  if (typeof value !== "string") fail(`Invalid ${label}`);
  const text = value.trim();
  if (text.length < min || text.length > max || hasControlCharacters(text)) {
    fail(`Invalid ${label}`);
  }
  return text;
};

export const readEmail = (value) => {
  if (typeof value !== "string" || value.length > 254) fail("Invalid email");
  // Case is preserved so existing accounts keep working unchanged.
  const email = value.trim();
  if (!validator.isEmail(email)) fail("Invalid email");
  return email;
};

export const readPassword = (value) => {
  if (typeof value !== "string" || value.length < 8 || value.length > 128) {
    fail("Password must be between 8 and 128 characters");
  }
  return value;
};

export const readOtp = (value) => {
  if (typeof value !== "string" || !/^\d{6}$/.test(value)) fail("Invalid verification code");
  return value;
};

export const readObjectId = (value) => {
  if (typeof value !== "string" || !/^[a-f\d]{24}$/i.test(value) || !mongoose.isValidObjectId(value)) {
    fail("Invalid identifier");
  }
  return value;
};

const parseJsonField = (value, label) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    fail(`Invalid ${label}`);
    return undefined;
  }
};

export const readStringArray = (value, label, { allowed, max = 30 } = {}) => {
  const parsed = parseJsonField(value, label);
  if (!Array.isArray(parsed) || parsed.length > max || parsed.some((item) => typeof item !== "string")) {
    fail(`Invalid ${label}`);
  }
  if (allowed && parsed.some((item) => !allowed.includes(item))) fail(`Invalid ${label}`);
  return [...parsed];
};

export const readStockMap = (value, { max = 30 } = {}) => {
  const parsed = parseJsonField(value, "stock");
  if (!isPlainObject(parsed) || Object.keys(parsed).length > max) fail("Invalid stock");

  const clean = {};
  for (const [rawKey, rawValue] of Object.entries(parsed)) {
    const key = String(rawKey).trim();
    if (!/^[A-Za-z0-9][A-Za-z0-9 _-]{0,15}$/.test(key)) fail("Invalid stock");
    if (["__proto__", "prototype", "constructor"].includes(key)) fail("Invalid stock");
    const numericValue = rawValue === "" ? 0 : Number(rawValue);
    if (!Number.isInteger(numericValue) || numericValue < 0 || numericValue > 100000) fail("Invalid stock");
    clean[key] = numericValue;
  }
  // Return a plain (non-null-prototype) object for Mongoose.
  return JSON.parse(JSON.stringify(clean));
};

export const readPrice = (value) => {
  const price = typeof value === "number" || typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(price) || price <= 0 || price > 10000000) fail("Invalid price");
  return Math.round(price * 100) / 100;
};

export const readPaymentMethod = (value) => {
  const method = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (method === "cod" || method === "cash on delivery") return "Cash on Delivery";
  if (method === "instapay") return "InstaPay";
  fail("Invalid payment method");
  return undefined;
};

export const READ_ORDER_STATUSES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Canceled",
];

export const readStatus = (value) => {
  if (typeof value !== "string" || !READ_ORDER_STATUSES.includes(value)) fail("Invalid order status");
  return value;
};

const ADDRESS_FIELDS = {
  email: 254,
  country: 120,
  firstName: 120,
  lastName: 120,
  address: 200,
  city: 120,
  state: 120,
  zip: 30,
  phone: 40,
};

export const readAddress = (value) => {
  const parsed = parseJsonField(value, "address");
  if (!isPlainObject(parsed)) fail("Invalid address");

  const address = {};
  for (const [field, max] of Object.entries(ADDRESS_FIELDS)) {
    address[field] = readText(parsed[field], field, { max });
  }
  if (!validator.isEmail(address.email)) fail("Invalid email");
  return address;
};

export const readProductFields = (body, { requireAll = true } = {}) => {
  const present = (key) => body[key] !== undefined;
  const values = {};

  if (requireAll || present("name")) values.name = readText(body.name, "name", { max: 120 });
  if (requireAll || present("description")) values.description = readText(body.description, "description", { max: 4000 });
  if (requireAll || present("price")) values.price = readPrice(body.price);
  if (requireAll || present("category")) values.category = readText(body.category, "category", { max: 60 });
  if (requireAll || present("subCategory")) values.subCategory = readText(body.subCategory, "subCategory", { max: 60 });
  if (requireAll || present("sizes")) {
    values.sizes = readStringArray(body.sizes, "sizes", { max: 30 }).map((size) =>
      readText(size, "size", { max: 20 })
    );
  }
  if (requireAll || present("colors")) {
    values.colors = readStringArray(body.colors, "colors", { max: 30 }).map((color) =>
      readText(color, "color", { max: 40 })
    );
  }
  if (requireAll || present("sizesStock")) {
    values.sizesStock = readStockMap(body.sizesStock);
    values.stock = Object.values(values.sizesStock).reduce((sum, count) => sum + count, 0);
  }
  if (requireAll || present("bestseller")) {
    values.bestseller = body.bestseller === true || body.bestseller === "true";
  }
  return values;
};

// Reusable row-level validation middleware.
export const validateBody = (schema) => (req, res, next) => {
  try {
    if (!isPlainObject(req.body)) fail("Invalid request body");
    req.validated = schema(req.body, req);
    next();
  } catch (error) {
    next(error);
  }
};
