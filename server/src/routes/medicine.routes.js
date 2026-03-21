import express from "express";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { uploadMedicine, getMedicines, updateMedicineDetails, getMyMedicines, getMedicineById, scanMedicineImage, deleteMedicine } from "../controllers/medicine.controller.js";

const router = express.Router();

// Public routes (or maybe mostly protected?)
// For now, browsing medicines might be public or user only. Let's keep it open or user based.
// Specific protected routes (Must match before /:id)
router.get("/my-medicines", verifyJWT, getMyMedicines);

// Public routes
router.get("/", getMedicines);
router.get("/:id", getMedicineById);

// Globally protected routes
router.use(verifyJWT);

// AI Scan Image (User)
router.post("/scan", upload.single("image"), scanMedicineImage);

// Upload medicine (User)
router.post("/upload", upload.single("image"), uploadMedicine);


// Update medicine (User/Admin)
router.patch("/:id", updateMedicineDetails);

// Delete medicine (User)
router.delete("/:id", deleteMedicine);

export default router;
