import { Router } from "express";
import {
    uploadRiderDocuments,
    verifyAadharQR,
    verifyDocumentParity,
    verifyPayoutDocs,
    submitKycConsent
} from "../controllers/kyc.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

// --- Secure KYC Flow (Triple-QR + Payout Security) ---

// 1. Upload Photos (Primary Docs + Backsides + Vehicle + Payout Proof)
router.route("/upload-docs").post(
    verifyJWT,
    verifyRole("rider"),
    upload.fields([
        { name: "aadharFront", maxCount: 1 },
        { name: "aadharBack", maxCount: 1 },
        { name: "panFront", maxCount: 1 },
        { name: "panBack", maxCount: 1 },
        { name: "licenseFront", maxCount: 1 },
        { name: "licenseBack", maxCount: 1 },
        { name: "rcFront", maxCount: 1 },
        { name: "rcBack", maxCount: 1 },
        { name: "insuranceFront", maxCount: 1 },
        { name: "bankProof", maxCount: 1 },
        { name: "selfie", maxCount: 1 }
    ]),
    uploadRiderDocuments
);

// 2. Verify Aadhaar via scanned QR string (Dual-Input Anchor)
router.route("/verify-aadhar-qr").post(verifyJWT, verifyRole("rider"), verifyAadharQR);

// 3. Verify Parity for PAN/DL/RC (Dual-Input: Photo + Scanned QR)
router.route("/verify-parity").post(verifyJWT, verifyRole("rider"), verifyDocumentParity);

// 4. Extract Payout Docs (Insurance, Bank)
router.route("/verify-payout").post(verifyJWT, verifyRole("rider"), verifyPayoutDocs);

// 5. Submit Final Consent for Admin Review
router.route("/submit-consent").post(verifyJWT, verifyRole("rider"), submitKycConsent);

export default router;
