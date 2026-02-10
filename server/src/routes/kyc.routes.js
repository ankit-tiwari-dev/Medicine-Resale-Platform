import { Router } from "express";
import {
    uploadRiderDocuments,
    verifyAadharQR,
    verifyDocumentsOCR,
    submitKycConsent
} from "../controllers/kyc.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

// --- Offline KYC Flow ---

// 1. Upload Photos
router.route("/upload-docs").post(
    verifyJWT,
    upload.fields([
        { name: "aadharFront", maxCount: 1 },
        { name: "aadharBack", maxCount: 1 },
        { name: "panFront", maxCount: 1 },
        { name: "panBack", maxCount: 1 },
        { name: "licenseFront", maxCount: 1 },
        { name: "licenseBack", maxCount: 1 },
        { name: "selfie", maxCount: 1 }
    ]),
    uploadRiderDocuments
);

// 2. Verify Aadhaar via scanned QR string
router.route("/verify-aadhar-qr").post(verifyJWT, verifyAadharQR);

// 3. Process OCR for PAN/DL
router.route("/verify-ocr").post(verifyJWT, verifyDocumentsOCR);

// 4. Submit Final Consent
router.route("/submit-consent").post(verifyJWT, submitKycConsent);

export default router;
