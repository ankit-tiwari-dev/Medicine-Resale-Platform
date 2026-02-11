import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rider } from "../models/rider.model.js";
import AadharService from "../utils/aadhar.service.js";
import OCRService from "../utils/ocr.service.js";
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
 * Step 3: Verify documents using OCR (PAN/DL)
 */
export const verifyDocumentsOCR = asyncHandler(async (req, res) => {
    const rider = await Rider.findOne({ userId: req.user._id });
    if (!rider) throw new ApiError(404, "Rider profile not found");

    const results = {};

    if (rider.documents.panFront) {
        const text = await OCRService.extractText(rider.documents.panFront);
        const panData = OCRService.parsePAN(text);
        if (panData) {
            rider.extractedData.pan = {
                panNumber: panData.panNumber,
                fullName: rider.extractedData.aadhar?.fullName,
                verifiedAt: new Date()
            };
            // Sync to top-level for unique constraint
            rider.panNumber = panData.panNumber;
            results.pan = "extracted";
        }
    }

    if (rider.documents.licenseFront) {
        const text = await OCRService.extractText(rider.documents.licenseFront);
        const dlData = OCRService.parseDL(text);
        if (dlData) {
            rider.extractedData.license = {
                licenseNumber: dlData.licenseNumber,
                fullName: rider.extractedData.aadhar?.fullName,
                dob: rider.extractedData.aadhar?.dob,
                verifiedAt: new Date()
            };
            // Sync to top-level for unique constraint
            rider.licenseNumber = dlData.licenseNumber;
            results.dl = "extracted";
        }
    }

    try {
        await rider.save();
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            throw new ApiError(400, `This ${field === 'panNumber' ? 'PAN' : 'Driving License'} is already verified with another account.`);
        }
        throw error;
    }

    return res.status(200).json(
        new ApiResponse(200, { extractedData: rider.extractedData, results }, "OCR verification completed")
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
        new ApiResponse(200, { status: rider.verificationStatus }, "KYC submitted for final review")
    );
});
