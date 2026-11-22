import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
} from "../controller/productController.js";
import { uploadProductImages } from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import { validateBody, readProductFields } from "../utils/validation.js";

const productRouter = express.Router();

const productValidation = validateBody((body) => readProductFields(body));

productRouter.post("/add", adminAuth, uploadProductImages, productValidation, addProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProducts);
// This route was previously public: anyone could change prices and stock.
productRouter.post("/update", adminAuth, productValidation, updateProduct);

export default productRouter;
