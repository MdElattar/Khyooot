import assert from "node:assert/strict";
import test from "node:test";

import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import { PlaceOrder, userOrders } from "../controller/orderController.js";

const makeRes = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const address = {
  email: "buyer@example.test",
  country: "EG",
  firstName: "A",
  lastName: "B",
  address: "Street 1",
  city: "Cairo",
  state: "Cairo",
  zip: "12345",
  phone: "01000000000",
};

const productA = {
  _id: "a".repeat(24),
  name: "Product A",
  price: 100,
  image: ["https://cdn.example.test/a.jpg"],
  sizes: ["M"],
  colors: ["Black"],
  sizesStock: { M: 5 },
};

const productB = {
  _id: "b".repeat(24),
  name: "Product B",
  price: 200,
  image: ["https://cdn.example.test/b.jpg"],
  sizes: ["L"],
  colors: ["Black"],
  sizesStock: { L: 5 },
};

const cart = {
  items: [
    { variantId: `${productA._id}_M_Black`, productId: productA._id, size: "M", color: "Black", count: 1 },
    { variantId: `${productB._id}_L_Black`, productId: productB._id, size: "L", color: "Black", count: 1 },
  ],
};

test("a later stock conflict rolls back earlier decrements and creates no order", async () => {
  const calls = [];
  let decrementCount = 0;

  cartModel.findOne = async () => cart;
  cartModel.deleteOne = async () => {
    throw new Error("cart must not be cleared on a failed order");
  };
  productModel.find = async () => [productA, productB];
  productModel.updateOne = async (filter, update) => {
    calls.push({ filter, update });
    const isDecrement = Object.values(update.$inc || {}).some((value) => value < 0);
    if (!isDecrement) return { matchedCount: 1 };
    decrementCount += 1;
    // First item succeeds, second item simulates a concurrent stock change.
    return { matchedCount: decrementCount === 1 ? 1 : 0 };
  };
  orderModel.create = async () => {
    throw new Error("order must not be created after a stock conflict");
  };
  userModel.findByIdAndUpdate = async () => {
    throw new Error("user cart must not be cleared on a failed order");
  };

  const req = {
    user: { _id: "c".repeat(24) },
    body: { address, paymentMethod: "cod" },
    file: null,
  };
  const res = makeRes();

  await PlaceOrder(req, res);

  assert.equal(res.statusCode, 409);
  assert.match(res.body.message, /Stock changed/);
  assert.equal(calls.length, 3);

  const firstDecrement = calls[0].update.$inc;
  assert.equal(firstDecrement[`sizesStock.M`], -1);
  assert.equal(firstDecrement.stock, -1);

  const rollback = calls[2].update.$inc;
  assert.equal(rollback[`sizesStock.M`], 1);
  assert.equal(rollback.stock, 1);
  assert.deepEqual(calls[2].filter, { _id: productA._id });
});

test("user order tracking always filters by the authenticated user id", async () => {
  const userId = "d".repeat(24);
  let capturedFilter;
  orderModel.find = (filter) => {
    capturedFilter = filter;
    return {
      sort() {
        return this;
      },
      limit() {
        return [];
      },
    };
  };

  const req = { user: { _id: userId }, body: { userId: "e".repeat(24) } };
  const res = makeRes();
  await userOrders(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(capturedFilter, { userId });
});
