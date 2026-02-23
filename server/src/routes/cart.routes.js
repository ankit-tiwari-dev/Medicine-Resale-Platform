import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToCart, removeFromCart, getCart, clearCart, updateCartItemQuantity } from "../controllers/cart.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getCart);
router.post("/add", addToCart);
router.patch("/update-quantity", updateCartItemQuantity);
router.delete("/remove/:medicineId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
