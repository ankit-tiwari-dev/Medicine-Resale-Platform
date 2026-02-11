import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createReview, getReviewsBySeller, getReviewsByMedicine } from "../controllers/review.controller.js";

const router = express.Router();

// Publicly accessible reviews
router.get("/seller/:sellerId", getReviewsBySeller);
router.get("/medicine/:medicineId", getReviewsByMedicine);

// Protected routes
router.use(verifyJWT);
router.post("/add", createReview);

export default router;
