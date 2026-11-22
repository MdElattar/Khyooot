import productModel from "../models/productModel.js";
import { fail } from "../utils/http.js";
import { uploadImageBuffer } from "../utils/imageUpload.js";
import { logInfo, logSecurity } from "../utils/logger.js";
import { readObjectId } from "../utils/validation.js";

const getValidated = (req) => {
  if (!req.validated) throw Object.assign(new Error("Validation required"), { status: 500 });
  return req.validated;
};

// Function for add product
const addProduct = async (req, res) => {
  try {
    const fields = getValidated(req);
    const files = req.files || {};
    const images = [files.image1, files.image2, files.image3, files.image4].filter(Boolean).flat();

    const imagesUrl = [];
    for (const file of images) {
      imagesUrl.push((await uploadImageBuffer(file, "khyoot/products")).url);
    }

    await productModel.create({
      ...fields,
      image: imagesUrl,
      date: Date.now(),
    });

    logInfo("product_added");
    return res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    if (error?.name === "MulterError") return fail(res, 400, "Invalid upload");
    logSecurity("product_add_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// Function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    return res.json({ success: true, products });
  } catch (error) {
    logSecurity("product_list_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// Function for removing product
const removeProduct = async (req, res) => {
  try {
    const id = readObjectId(req.body?.id);
    const result = await productModel.findByIdAndDelete(id);
    if (!result) return fail(res, 404, "Product not found");
    logInfo("product_removed", { productId: id });
    return res.json({ success: true, message: "Product removed" });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    logSecurity("product_remove_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// Function for single product info
const singleProduct = async (req, res) => {
  try {
    const productId = readObjectId(req.body?.productId);
    const product = await productModel.findById(productId);
    if (!product) return fail(res, 404, "Product not found");
    return res.json({ success: true, product });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    logSecurity("product_single_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

// Function for updating product details (admin only at the route level)
const updateProduct = async (req, res) => {
  try {
    const id = readObjectId(req.body?.id);
    const fields = getValidated(req);
    const result = await productModel.findByIdAndUpdate(id, fields, {
      runValidators: true,
      new: true,
    });
    if (!result) return fail(res, 404, "Product not found");
    logInfo("product_updated", { productId: id });
    return res.json({ success: true, message: "Product Updated Successfully" });
  } catch (error) {
    if (error?.publicMessage) return fail(res, 400, error.publicMessage);
    logSecurity("product_update_error", { name: error?.name });
    return fail(res, 500, "Something went wrong");
  }
};

export { addProduct, listProducts, removeProduct, singleProduct, updateProduct };
