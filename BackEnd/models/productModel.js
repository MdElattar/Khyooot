import mongoose from "mongoose";
import "../config/mongoose.js";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 4000 },
  price: { type: Number, required: true, min: 0.01, max: 10000000 },
  image: { type: Array, required: true, validate: (value) => Array.isArray(value) && value.length <= 4 },
  category: { type: String, required: true, maxlength: 60 },
  subCategory: { type: String, required: true, maxlength: 60 },
  sizes: { type: Array, required: true },
  colors: { type: Array, required: true },
  sizesStock: { type: Object, required: true, default: {} },
  stock: { type: Number, required: true, default: 0, min: 0 },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
