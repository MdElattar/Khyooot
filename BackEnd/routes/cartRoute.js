import express from "express";
import { addToCart, getUserCart, updateCart } from "../controller/cartController.js";
import authUser from "../middleware/authUser.js";
import { cartLimiter } from "../middleware/rateLimit.js";

const cartRouter = express.Router();

cartRouter.post("/get", authUser, cartLimiter, getUserCart);
cartRouter.post("/add", authUser, cartLimiter, addToCart);
cartRouter.post("/update", authUser, cartLimiter, updateCart);

export default cartRouter;
