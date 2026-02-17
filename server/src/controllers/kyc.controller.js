import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rider } from "../models/rider.model.js";
import AadharService from "../utils/aadhar.service.js";
import OCRService from "../utils/ocr.service.js";
import QRService from "../utils/qr.service.js";
import { uploadToCloudinary } from "../utils/cloudinary.helper.js";




/**
 * Step 1: Upload identity documents (Photos)
 */
export const uploadRiderDocuments = asyncHandler(async (req, res) => {
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
        throw new ApiError(400, "No documents uploaded");
    }

    const rider = await Rider.findOne({ userId: req.user._id });
    if (!rider) throw new ApiError(404, "Rider profile not found");

    const documentUrls = {};

    // Handle multiple fields: aadharFront/Back, panFront/Back, licenseFront/Back
    for (const fieldname in files) {
        const file = files[fieldname][0];
        const url = await uploadToCloudinary(file.buffer, "rider-kyc", file.originalname);
        documentUrls[fieldname] = url;
        rider.documents[fieldname] = url;
    }

    await rider.save();

    return res.status(200).json(
        new ApiResponse(200, { documents: rider.documents }, "Documents uploaded successfully")
    );
});

/**
 * Step 2: Verify Aadhaar using Secure QR decimal string + Front Photo OCR
 */
export const verifyAadharQR = asyncHandler(async (req, res) => {
    const { qrData } = req.body;
    if (!qrData) throw new ApiError(400, "Aadhaar QR data is required");

    const decoded = AadharService.decodeSecureQR(qrData);
    if (!decoded) throw new ApiError(400, "Failed to decode Aadhaar QR. Invalid or corrupted data.");

    const rider = await Rider.findOne({ userId: req.user._id });
    if (!rider) throw new ApiError(404, "Rider profile not found");

    if (!rider.documents.aadharFront) {
        throw new ApiError(400, "Please upload your Aadhaar front photo first");
    }

    // --- Cross-Verification Step ---
    // Extract text from the uploaded Aadhaar Front photo
    const ocrText = await OCRService.extractText(rider.documents.aadharFront);
    const sanitizedOcr = ocrText.toLowerCase();
    const sanitizedName = decoded.name.toLowerCase();

    // Check if the name in the QR matches the name on the card (simple partial match)
    // We split the name into parts to handle middle names or different ordering
    const nameParts = sanitizedName.split(" ").filter(p => p.length > 2);
    const nameMatch = nameParts.every(part => sanitizedOcr.includes(part));

    if (!nameMatch) {
        rider.verificationStatus = "document_mismatch";
        await rider.save();
        throw new ApiError(400, "Name mismatch: The name on your Aadhaar card does not match your profile name.");
    }

    // Map decoded data to model
    rider.extractedData.aadhar = {
        fullName: decoded.name,
        dob: decoded.dob,
        gender: decoded.gender,
        pincode: decoded.pincode,
        state: decoded.state,
        district: decoded.district,
        vtc: decoded.vtc,
        maskedAadhar: decoded.maskedAadhar,
        isCrossVerified: true,
        verifiedAt: new Date()
    };

    // If a photo was extracted from QR, upload it to Cloudinary
    if (decoded.image && decoded.image.length > 100) {
        const photoUrl = await uploadToCloudinary(decoded.image, "rider-avatars", "aadhar_extracted_photo.jp2");
        rider.extractedData.aadhar.profileImage = photoUrl;
    }

    // Reset status if it was mismatch
    if (rider.verificationStatus === "document_mismatch") {
        rider.verificationStatus = "pending";
    }

    await rider.save();

    return res.status(200).json(
        new ApiResponse(200, { aadhar: rider.extractedData.aadhar }, "Aadhaar QR cross-verified with photo successfully")
    );
});

/**
 * Step 3: Verify Document Parity (Dual-Input: Photo + QR)
 * Handles PAN, DL, and RC
 */
export const verifyDocumentParity = asyncHandler(async (req, res) => {
    const { docType, qrData } = req.body;
    if (!docType || !qrData) throw new ApiError(400, "Document type and QR data are required");

    const rider = await Rider.findOne({ userId: req.user._id });
    if (!rider) throw new ApiError(404, "Rider profile not found");

    let extractedQR;
    let imageUrl;
    let isQRReadable = true;

    switch (docType) {
        case 'pan':
            extractedQR = QRService.parsePAN(qrData);
            imageUrl = rider.documents.panFront;
            break;
        case 'license':
            extractedQR = QRService.parseDL(qrData);
            imageUrl = rider.documents.licenseFront;
            break;
        case 'rc':
            extractedQR = QRService.parseRC(qrData);
            imageUrl = rider.documents.rcFront;
            break;
        default:
            throw new ApiError(400, "Invalid document type for parity check");
    }

    if (!imageUrl) throw new ApiError(400, `Please upload ${docType} photo first`);

    let parityResult;
    if (extractedQR) {
        // Full Triple-QR Secure Parity Check
        parityResult = await QRService.verifyParity(extractedQR, imageUrl, docType);
    } else {
        // Fallback: AI Identification + Profile Matching (Level 2 Security)
        isQRReadable = false;

        const aiResponse = await OCRService.groqIdentify(imageUrl, docType.toUpperCase());
        if (!aiResponse) throw new ApiError(400, `Failed to analyze ${docType} image. Please ensure the photo is clear.`);

        const aiData = aiResponse.data;
        const fraudScore = aiResponse.fraudScore || 0;
        const isAuthentic = aiResponse.isAuthentic !== false;
        const hologramValid = aiResponse.hologramValid !== false;
        const signatureValid = aiResponse.signatureValid !== false;

        // Profile Matching: Ensure at least one part of the extracted name matches a part of the profile name
        const userNames = req.user.name.toLowerCase().split(" ").filter(n => n.length > 2);
        const extractedName = (aiData.fullName || aiData.ownerName || "").toLowerCase();
        const profileMatch = userNames.some(namePart => extractedName.includes(namePart));

        parityResult = {
            visualName: aiData.fullName || aiData.ownerName,
            visualNumber: aiData.panNumber || aiData.licenseNumber || aiData.vehicleNumber,
            matchScore: profileMatch ? 95 : 70,
            fraudScore: fraudScore,
            isAuthentic: isAuthentic,
            // Hard Reject: If fraudScore > 0 OR isAuthentic is false OR hologram/signature missing
            isMatch: profileMatch && isAuthentic && fraudScore === 0 && hologramValid && signatureValid,
            warning: "QR code format unrecognized. Verified via High-Security AI Vision.",
            forensicNote: aiResponse.forensicNote
        };

        // Populate extractedQR so subsequent logic works
        extractedQR = {
            panNumber: aiData.panNumber,
            licenseNumber: aiData.licenseNumber,
            rcNumber: aiData.rcNumber,
            vehicleNumber: aiData.vehicleNumber,
            fullName: aiData.fullName || aiData.ownerName,
            dob: aiData.dob
        };
    }

    if (!parityResult.isMatch) {
        rider.verificationStatus = "document_mismatch";
        // Record forensic failure for audit
        if (parityResult.forensicNote) {
            rider.verificationScores.forensicAudit.push(`[${docType.toUpperCase()} FAIL] ${parityResult.forensicNote}`);
        }
        await rider.save();
        throw new ApiError(400, `Verification failed: ${parityResult.reason || "Data doesn't match your profile or card is fabricated."}`);
    }

    // Record forensic success for audit TaskBoundary
    if (parityResult.fraudScore !== undefined) {
        rider.verificationScores.aiFraudScore = Math.max(rider.verificationScores.aiFraudScore, parityResult.fraudScore);
    }
    if (parityResult.forensicNote) {
        rider.verificationScores.forensicAudit.push(`[${docType.toUpperCase()} PASS] ${parityResult.forensicNote}`);
    }

    // Save extracted data
    if (docType === 'pan') {
        rider.extractedData.pan = {
            panNumber: extractedQR.panNumber,
            fullName: extractedQR.fullName,
            verifiedAt: new Date()
        };
        rider.panNumber = extractedQR.panNumber;
    } else if (docType === 'license') {
        rider.extractedData.license = {
            licenseNumber: extractedQR.licenseNumber,
            fullName: extractedQR.fullName,
            dob: extractedQR.dob,
            verifiedAt: new Date()
        };
        rider.licenseNumber = extractedQR.licenseNumber;
    } else if (docType === 'rc') {
        rider.vehicleDetails.rcNumber = extractedQR.rcNumber;
        rider.vehicleDetails.vehicleNumber = extractedQR.vehicleNumber;
    }

    await rider.save();

    return res.status(200).json(
        new ApiResponse(200, { extractedData: rider.extractedData, parityResult }, `${docType.toUpperCase()} verified with QR-OCR parity successfully`)
    );
});

/**
 * Step 4: Verify Payout & Legal Docs (Insurance, Bank)
 */
export const verifyPayoutDocs = asyncHandler(async (req, res) => {
    const rider = await Rider.findOne({ userId: req.user._id });
    if (!rider) throw new ApiError(404, "Rider profile not found");

    const results = {};

    if (rider.documents.insuranceFront) {
        const aiResponse = await OCRService.groqIdentify(rider.documents.insuranceFront, 'Insurance');
        if (aiResponse && aiResponse.isAuthentic && aiResponse.fraudScore === 0 && aiResponse.hologramValid && aiResponse.signatureValid) {
            const insuranceData = aiResponse.data;
            rider.insurance = {
                policyNumber: insuranceData.policyNumber,
                expiryDate: new Date(insuranceData.expiryDate),
                isVerified: false
            };
            results.insurance = "extracted_verified";
        } else {
            results.insurance = "rejected_forgery";
        }
    }

    if (rider.documents.bankProof) {
        const aiResponse = await OCRService.groqIdentify(rider.documents.bankProof, 'Bank');
        if (aiResponse && aiResponse.isAuthentic && aiResponse.fraudScore === 0 && aiResponse.hologramValid && aiResponse.signatureValid) {
            const bankData = aiResponse.data;
            rider.bankDetails = {
                accountNumber: bankData.accountNumber,
                ifsc: bankData.ifsc,
                bankName: bankData.bankName,
                holderName: bankData.holderName,
                isVerified: false
            };
            results.bank = "extracted_verified";
            rider.verificationScores.forensicAudit.push(`[BANK PASS] ${aiResponse.forensicNote}`);
        } else {
            results.bank = "rejected_forgery";
            if (aiResponse?.forensicNote) {
                rider.verificationScores.forensicAudit.push(`[BANK FAIL] ${aiResponse.forensicNote}`);
            }
        }
    }

    // Average or aggregate scores if needed TaskBoundary
    if (results.insurance === "extracted_verified" || results.bank === "extracted_verified") {
        rider.verificationScores.integrity = 95; // High integrity if AI passes multiple docs
    }

    await rider.save();

    return res.status(200).json(
        new ApiResponse(200, { results }, "Payout documents processed successfully")
    );
});

/**
 * Step 4: Final Consent and Status Update
 */
export const submitKycConsent = asyncHandler(async (req, res) => {
    const { consentGiven } = req.body;
    if (!consentGiven) throw new ApiError(400, "Consent is required to proceed");

    const rider = await Rider.findOne({ userId: req.user._id });
    if (!rider) throw new ApiError(404, "Rider profile not found");

    // Finalize status
    rider.consent = {
        isGiven: true,
        timestamp: new Date(),
        ipAddress: req.ip
    };
    rider.verificationStatus = "verified_pending_admin";

    await rider.save();

    return res.status(200).json(
        new ApiResponse(200, { status: rider.verificationStatus }, "KYC submitted for final review. Admin will verify within 2 business days.")
    );
});
