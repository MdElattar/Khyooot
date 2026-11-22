import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import { fail } from "../utils/http.js";
import { logSecurity } from "../utils/logger.js";
import { readObjectId, readText, ValidationError } from "../utils/validation.js";

const MAX_PER_VARIANT = 100;

const syncCartToUser = async (userId, cart) => {
  const cartData = {};
  for (const item of cart.items) {
    cartData[item.variantId] = {
      productId: item.productId,
      size: item.size,
      color: item.color,
      count: item.count,
    };
  }
  await userModel.findByIdAndUpdate(userId, { cartData });
};

const readVariantPart = (value, label) => {
  const text = readText(value, label, { max: 40 });
  if (text.includes("_")) throw new ValidationError(`Invalid ${label}`);
  return text;
};

const ensureVariantAvailable = async (productId, size, color, requestedCount) => {
  const product = await productModel.findById(productId);
  if (!product) throw new ValidationError("Product not found");
  if (Array.isArray(product.sizes) && product.sizes.length && !product.sizes.includes(size)) {
    throw new ValidationError("Invalid size");
  }
  if (Array.isArray(product.colors) && product.colors.length && !product.colors.includes(color)) {
    throw new ValidationError("Invalid color");
  }
  const available = Number(product.sizesStock?.[size]);
  if (Number.isFinite(available) && requestedCount > available) {
    throw new ValidationError("Out of stock");
  }
};

const handleError = (res, error, event) => {
  if (error?.publicMessage) return fail(res, 400, error.publicMessage);
  logSecurity(event, { name: error?.name });
  return fail(res, 500, "Something went wrong");
};

// GET USER CART
const getUserCart = async (req, res) => {
  try {
    const userId = String(req.user._id);
    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = await cartModel.create({ userId, items: [] });
      await syncCartToUser(userId, cart);
    }
    return res.json({ success: true, cart });
  } catch (error) {
    return handleError(res, error, "cart_get_error");
  }
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const userId = String(req.user._id);
    const productId = readObjectId(req.body?.productId);
    const size = readVariantPart(req.body?.size, "size");
    const color = readVariantPart(req.body?.color, "color");
    const variantId = `${productId}_${size}_${color}`;

    let cart = await cartModel.findOne({ userId });
    if (!cart) cart = await cartModel.create({ userId, items: [] });

    const index = cart.items.findIndex((item) => item.variantId === variantId);
    const nextCount = index > -1 ? Number(cart.items[index].count) + 1 : 1;
    if (nextCount > MAX_PER_VARIANT) throw new ValidationError("Cart quantity limit reached");
    await ensureVariantAvailable(productId, size, color, nextCount);

    if (index > -1) cart.items[index].count = nextCount;
    else cart.items.push({ variantId, productId, size, color, count: 1 });

    await cart.save();
    await syncCartToUser(userId, cart);
    return res.json({ success: true, cart });
  } catch (error) {
    return handleError(res, error, "cart_add_error");
  }
};

// UPDATE CART (increase / decrease / remove)
const updateCart = async (req, res) => {
  try {
    const userId = String(req.user._id);
    const variantId = readText(req.body?.variantId, "variantId", { max: 120 });
    const action = readText(req.body?.action, "action", { max: 20 });
    if (!["increase", "decrease", "remove"].includes(action)) {
      throw new ValidationError("Invalid cart action");
    }

    const cart = await cartModel.findOne({ userId });
    if (!cart) return fail(res, 404, "Cart not found");

    const item = cart.items.find((entry) => entry.variantId === variantId);
    if (!item) return fail(res, 404, "Item not found");

    if (action === "increase") {
      const nextCount = Number(item.count) + 1;
      if (nextCount > MAX_PER_VARIANT) throw new ValidationError("Cart quantity limit reached");
      await ensureVariantAvailable(item.productId, item.size, item.color, nextCount);
      item.count = nextCount;
    } else if (action === "decrease") {
      if (item.count > 1) item.count -= 1;
      else cart.items = cart.items.filter((entry) => entry.variantId !== variantId);
    } else {
      cart.items = cart.items.filter((entry) => entry.variantId !== variantId);
    }

    await cart.save();
    await syncCartToUser(userId, cart);
    return res.json({ success: true, cart });
  } catch (error) {
    return handleError(res, error, "cart_update_error");
  }
};

export { getUserCart, addToCart, updateCart };
