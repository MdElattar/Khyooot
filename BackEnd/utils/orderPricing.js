import { ValidationError } from "./validation.js";

const configuredFee = Number(process.env.DELIVERY_FEE ?? 80);
export const DELIVERY_FEE = Number.isFinite(configuredFee) && configuredFee >= 0 ? configuredFee : 80;

const round = (value) => Math.round(value * 100) / 100;

// Prices, quantities and line items are derived from the database-backed cart
// and catalog. Nothing supplied by the client is used for totals.
export const buildPricedOrder = ({ cart, products }) => {
  if (!cart?.items?.length) throw new ValidationError("Your cart is empty");

  const byId = new Map(products.map((product) => [String(product._id), product]));
  const items = [];
  let subtotal = 0;

  for (const cartItem of cart.items) {
    const product = byId.get(String(cartItem.productId));
    if (!product) throw new ValidationError("Your cart contains an unavailable product");

    const size = String(cartItem.size || "");
    const color = String(cartItem.color || "");
    const quantity = Number(cartItem.count);
    const price = Number(product.price);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new ValidationError("Invalid quantity in cart");
    }
    if (!Number.isFinite(price) || price <= 0) {
      throw new ValidationError("Invalid product price");
    }
    if (Array.isArray(product.sizes) && product.sizes.length && !product.sizes.includes(size)) {
      throw new ValidationError("Invalid size in cart");
    }
    if (Array.isArray(product.colors) && product.colors.length && !product.colors.includes(color)) {
      throw new ValidationError("Invalid color in cart");
    }

    const available = Number(product.sizesStock?.[size]);
    if (Number.isFinite(available) && available < quantity) {
      throw new ValidationError(`Insufficient stock for ${product.name} (${size})`);
    }

    subtotal += price * quantity;
    items.push({
      productId: String(product._id),
      name: product.name,
      // Preserve the order-item image shape expected by the existing UI
      // (an array), while tolerating legacy products with a single URL.
      image: Array.isArray(product.image) ? product.image : product.image ? [product.image] : [],
      price,
      size,
      color,
      quantity,
    });
  }

  const amount = round(subtotal + DELIVERY_FEE);
  return { items, subtotal: round(subtotal), deliveryFee: DELIVERY_FEE, amount };
};
