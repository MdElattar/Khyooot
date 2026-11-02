import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      colors,
      sizesStock, // استقبال مخزون المقاسات
      bestseller,
    } = req.body;
    
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const parsedSizesStock = sizesStock ? JSON.parse(sizesStock) : {};
    
    // حساب الإجمالي التلقائي للمخزون
    const totalStock = Object.values(parsedSizesStock).reduce((acc, val) => acc + Number(val || 0), 0);

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      stock: totalStock,
      sizesStock: parsedSizesStock,
      bestseller: bestseller === "true" ? true : false,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for single product Info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for updating product details
const updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, category, subCategory, sizes, colors, sizesStock, bestseller } = req.body;

    const parsedSizesStock = typeof sizesStock === "string" ? JSON.parse(sizesStock) : (sizesStock || {});
    const totalStock = Object.values(parsedSizesStock).reduce((acc, val) => acc + Number(val || 0), 0);

    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      stock: totalStock,
      sizesStock: parsedSizesStock,
      bestseller: bestseller === "true" || bestseller === true,
      sizes: typeof sizes === "string" ? JSON.parse(sizes) : sizes,
      colors: typeof colors === "string" ? JSON.parse(colors) : colors,
    };

    await productModel.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "Product Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct, updateProduct };