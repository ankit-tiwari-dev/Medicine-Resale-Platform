import express from "express";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { uploadMedicine, getMedicines, updateMedicineDetails, getMyMedicines, getMedicineById } from "../controllers/medicine.controller.js";

const router = express.Router();

// Public routes (or maybe mostly protected?)
// For now, browsing medicines might be public or user only. Let's keep it open or user based.
router.get("/", getMedicines);

// Protected routes
router.use(verifyJWT);

// Upload medicine (User)
router.post("/upload", upload.array("images", 5), uploadMedicine);

// Get my uploaded medicines (User)
router.get("/my-medicines", getMyMedicines);

// Update medicine (User/Admin)
router.patch("/:id", updateMedicineDetails);

// Get single medicine details
router.get("/:id", getMedicineById);

export default router;
