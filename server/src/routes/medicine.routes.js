import express from "express";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { uploadMedicine, getMedicines, updateMedicineDetails, getMyMedicines, getMedicineById, scanMedicineImage, deleteMedicine } from "../controllers/medicine.controller.js";

const router = express.Router();

// Public routes (or maybe mostly protected?)
// For now, browsing medicines might be public or user only. Let's keep it open or user based.
router.get("/", getMedicines);

// Protected routes
router.use(verifyJWT);

// AI Scan Image (User)
router.post("/scan", upload.single("image"), scanMedicineImage);

// Get my uploaded medicines (User)
router.get("/my-medicines", getMyMedicines);

// Upload medicine (User)
router.post("/upload", upload.single("image"), uploadMedicine);

// Get single medicine details
router.get("/:id", getMedicineById);

// Update medicine (User/Admin)
router.patch("/:id", updateMedicineDetails);

// Delete medicine (User)
router.delete("/:id", deleteMedicine);

export default router;
