import mongoose from "mongoose";
import "../config/mongoose.js";

const cartItemSchema = new mongoose.Schema(
  {
    variantId: { type: String, required: true, maxlength: 160 },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    size: { type: String, required: true, maxlength: 40 },
    color: { type: String, required: true, maxlength: 40 },
    count: { type: Number, default: 1, min: 1, max: 100 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1, "items.variantId": 1 });

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
