import assert from "node:assert/strict";
import crypto from "node:crypto";
import express from "express";
import test from "node:test";
import request from "supertest";

// Test-only fixture values. These are not deployment secrets.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-only-jwt-secret-for-unit-tests-0001";
process.env.ADMIN_EMAIL = "admin@example.test";
process.env.ADMIN_PASSWORD = "test-only-admin-password";
process.env.CORS_ORIGINS = "http://localhost:5173";
process.env.LOGIN_RATE_LIMIT = "3";
process.env.GLOBAL_RATE_LIMIT = "1000";
process.env.CART_RATE_LIMIT = "1000";
process.env.ORDER_RATE_LIMIT = "1000";
process.env.REGISTER_RATE_LIMIT = "1000";
process.env.ADMIN_LOGIN_RATE_LIMIT = "1000";
process.env.OTP_REQUEST_RATE_LIMIT = "1000";
process.env.OTP_VERIFY_RATE_LIMIT = "1000";

const { default: app } = await import("../app.js");
const { default: adminAuth } = await import("../middleware/adminAuth.js");
const { default: authUser } = await import("../middleware/authUser.js");
const { setUserLookup } = await import("../utils/userLookup.js");
const { signAdminToken, signUserToken, verifyToken } = await import("../utils/tokens.js");
const { BCRYPT_ROUNDS, generateOtp, hashOtp, hashPassword, verifyOtp } = await import("../utils/crypto.js");
const { buildPricedOrder } = await import("../utils/orderPricing.js");
const { validateImageBuffer } = await import("../middleware/multer.js");
const mongoose = (await import("../config/mongoose.js")).default;

const probeAdmin = express();
probeAdmin.post("/admin-only", adminAuth, (req, res) => res.json({ ok: true }));

const probeUser = express();
probeUser.post("/user-only", authUser, (req, res) => res.json({ ok: true, userId: req.body.userId }));

test("product update is rejected without authentication", async () => {
  const response = await request(app).post("/api/product/update").send({ id: "a".repeat(24) });
  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
});

test("admin middleware accepts a signed admin token", async () => {
  const token = signAdminToken(process.env.ADMIN_EMAIL);
  const response = await request(probeAdmin).post("/admin-only").set("token", token);
  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
  assert.equal(verifyToken(token).role, "admin");
});

test("legacy plaintext admin credential string is rejected", async () => {
  const legacy = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
  const response = await request(probeAdmin).post("/admin-only").set("token", legacy);
  assert.equal(response.status, 401);
});

test("a normal user token cannot reach admin routes", async () => {
  const token = signUserToken({ _id: "a".repeat(24), tokenVersion: 0 });
  const adminResponse = await request(probeAdmin).post("/admin-only").set("token", token);
  assert.equal(adminResponse.status, 403);

  const productResponse = await request(app)
    .post("/api/product/update")
    .set("authorization", `Bearer ${token}`)
    .send({ id: "a".repeat(24) });
  assert.equal(productResponse.status, 403);
});

test("user identity is taken from the token, never from the request body", async () => {
  const token = signUserToken({ _id: "b".repeat(24), tokenVersion: 2 });
  setUserLookup(async () => ({ tokenVersion: 2 }));

  const response = await request(probeUser)
    .post("/user-only")
    .set("authorization", token)
    .send({ userId: "c".repeat(24) });
  assert.equal(response.status, 200);
  assert.equal(response.body.userId, "b".repeat(24));

  const stale = await request(probeUser)
    .post("/user-only")
    .set("authorization", signUserToken({ _id: "b".repeat(24), tokenVersion: 1 }));
  assert.equal(stale.status, 401);

  setUserLookup(async () => ({ tokenVersion: 0 }));
});

test("security headers are present and fingerprint header is removed", async () => {
  const response = await request(app).get("/");
  assert.equal(response.status, 200);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.match(response.headers["content-security-policy"], /frame-ancestors 'none'/);
  assert.equal(response.headers["x-powered-by"], undefined);
});

test("CORS only allows explicitly configured origins", async () => {
  const allowed = await request(app).get("/").set("Origin", "http://localhost:5173");
  assert.equal(allowed.headers["access-control-allow-origin"], "http://localhost:5173");

  const denied = await request(app).get("/").set("Origin", "https://evil.example");
  assert.equal(denied.status, 403);
  assert.equal(denied.body.success, false);
});

test("login attempts are rate limited", async () => {
  const body = { email: "brute-force-test@example.test", password: "short" };
  let last;
  for (let i = 0; i < Number(process.env.LOGIN_RATE_LIMIT) + 1; i += 1) {
    last = await request(app).post("/api/user/login").send(body);
  }
  assert.equal(last.status, 429);
});

test("NoSQL operator objects are rejected by input validation", async () => {
  const response = await request(app)
    .post("/api/user/register")
    .send({ name: "Test", email: { $ne: null }, password: "password123" });
  assert.equal(response.status, 400);
  assert.equal(mongoose.get("sanitizeFilter"), true);
});

test("malformed JSON produces a generic client error without stack traces", async () => {
  const response = await request(app)
    .post("/api/user/login")
    .set("Content-Type", "application/json")
    .send("{not-json");
  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid JSON body");
  assert.equal(JSON.stringify(response.body).includes("at "), false);
});

test("order totals are computed from catalog prices, not client input", () => {
  const product = {
    _id: "d".repeat(24),
    name: "Test Hoodie",
    price: 100,
    image: ["https://cdn.example.test/hoodie.jpg"],
    sizes: ["M"],
    colors: ["Black"],
    sizesStock: { M: 5 },
  };
  const cart = {
    items: [{ productId: product._id, size: "M", color: "Black", count: 2 }],
  };
  const priced = buildPricedOrder({ cart, products: [product] });
  assert.equal(priced.subtotal, 200);
  assert.equal(priced.amount, 280);
  assert.equal(priced.items[0].price, 100);
  assert.deepEqual(priced.items[0].image, ["https://cdn.example.test/hoodie.jpg"]);
  assert.throws(
    () => buildPricedOrder({ cart: { items: [{ ...cart.items[0], count: 9 }] }, products: [product] }),
    /Insufficient stock/
  );
});

test("OTPs are numeric, hashed at rest and single-use verifiable", async () => {
  const otp = generateOtp();
  assert.match(otp, /^\d{6}$/);
  const hash = await hashOtp(otp);
  assert.notEqual(hash, otp);
  assert.equal(await verifyOtp(otp, hash), true);
  assert.equal(await verifyOtp("000000", hash), false);

  const passwordHash = await hashPassword("password123");
  assert.equal(passwordHash.startsWith(`$2b$${String(BCRYPT_ROUNDS).padStart(2, "0")}$`), true);
});

test("image upload validation uses MIME, extension and content checks", () => {
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), crypto.randomBytes(16)]);
  assert.equal(validateImageBuffer({ buffer: png, mimetype: "image/png" }), true);
  assert.throws(() => validateImageBuffer({ buffer: Buffer.from("<?php echo 1; ?>") }), /Invalid image content/);
});

test("payment receipts are rejected unless they are allowed image files", async () => {
  const token = signUserToken({ _id: "e".repeat(24), tokenVersion: 0 });
  setUserLookup(async () => ({ tokenVersion: 0 }));
  const response = await request(app)
    .post("/api/order/place")
    .set("authorization", token)
    .field("address", JSON.stringify({
      email: "test@example.test", country: "EG", firstName: "A", lastName: "B",
      address: "Street", city: "Cairo", state: "Cairo", zip: "12345", phone: "01000000000",
    }))
    .field("paymentMethod", "InstaPay")
    .attach("receipt", Buffer.from("not-an-image"), { filename: "receipt.php", contentType: "application/x-php" });
  assert.equal(response.status, 400);
  assert.match(response.body.message, /Only supported image files/);
  setUserLookup(async () => ({ tokenVersion: 0 }));
});

test("admin login issues role-bearing expiring tokens only for valid credentials", async () => {
  const bad = await request(app)
    .post("/api/user/admin")
    .send({ email: process.env.ADMIN_EMAIL, password: "wrong-password" });
  assert.equal(bad.status, 401);
  assert.equal(bad.body.token, undefined);

  const good = await request(app)
    .post("/api/user/admin")
    .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  assert.equal(good.status, 200);
  const payload = verifyToken(good.body.token);
  assert.equal(payload.role, "admin");
  assert.ok(payload.exp > payload.iat);
});
