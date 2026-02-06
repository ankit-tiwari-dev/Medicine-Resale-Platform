import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder, getMyOrders, getOrderDetails, getOrderTracking, confirmDelivery } from "../controllers/order.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id/tracking", getOrderTracking);
router.post("/:id/confirm-delivery", confirmDelivery);
router.get("/:id", getOrderDetails);

export default router;
