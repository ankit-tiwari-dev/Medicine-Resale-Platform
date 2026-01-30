import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPaymentOrder, verifyPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/create-order", createPaymentOrder);
router.post("/verify", verifyPayment);

export default router;
