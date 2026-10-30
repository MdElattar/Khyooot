import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    variantId: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    count: { type: Number, default: 1 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
