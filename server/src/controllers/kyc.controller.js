import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rider } from "../models/rider.model.js";
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
 * Step 2: Verify Aadhaar using AI Identification + Front Photo
 */
export const verifyAadhar = asyncHandler(async (req, res) => {
    const rider = await Rider.findOne({ userId: req.user._id });
    if (!rider) throw new ApiError(404, "Rider profile not found");

    if (!rider.documents.aadharFront) {
        throw new ApiError(400, "Please upload your Aadhaar front photo first");
    }

    // AI Identification + Forensic Audit
    const aiResponse = await OCRService.groqIdentify(rider.documents.aadharFront, "AADHAAR");
    if (!aiResponse) throw new ApiError(400, "Failed to analyze Aadhaar image. Please ensure the photo is clear.");

    const aiData = aiResponse.data;
    const fraudScore = aiResponse.fraudScore || 0;
    const isAuthentic = aiResponse.isAuthentic !== false;
    const hologramValid = aiResponse.hologramValid !== false;

    // Profile Matching: Ensure name matches
    const userNames = req.user.name.toLowerCase().split(" ").filter(n => n.length > 2);
    const extractedName = (aiData.fullName || "").toLowerCase();
    const profileMatch = userNames.some(namePart => extractedName.includes(namePart));

    const isMatch = profileMatch && isAuthentic && fraudScore === 0 && hologramValid;

    if (!isMatch) {
        rider.verificationStatus = "document_mismatch";
        if (aiResponse.forensicNote) {
            rider.verificationScores.forensicAudit.push(`[AADHAAR FAIL] ${aiResponse.forensicNote}`);
        }
        await rider.save();
        throw new ApiError(400, "Aadhaar verification failed. Name mismatch or forgery detected.");
    }

    // Map extracted data to model
    rider.extractedData.aadhar = {
        fullName: aiData.fullName,
        dob: aiData.dob,
        gender: aiData.gender,
        pincode: aiData.pincode,
        state: aiData.state,
        district: aiData.district,
        maskedAadhar: aiData.aadharNumber ? `XXXX XXXX ${aiData.aadharNumber.slice(-4)}` : null,
        isCrossVerified: true,
        verifiedAt: new Date()
    };

    // Record forensic success
    rider.verificationScores.aiFraudScore = Math.max(rider.verificationScores.aiFraudScore, fraudScore);
    if (aiResponse.forensicNote) {
        rider.verificationScores.forensicAudit.push(`[AADHAAR PASS] ${aiResponse.forensicNote}`);
    }

    // Reset status if it was mismatch
    if (rider.verificationStatus === "document_mismatch") {
        rider.verificationStatus = "pending";
    }

    await rider.save();

    return res.status(200).json(
        new ApiResponse(200, { aadhar: rider.extractedData.aadhar }, "Aadhaar verified via AI successfully")
    );
});

/**
 * Step 3: Verify Document (AI-only)
 * Handles PAN, DL, and RC
 */
export const verifyDocument = asyncHandler(async (req, res) => {
    const { docType } = req.body;
    if (!docType) throw new ApiError(400, "Document type is required");

    const rider = await Rider.findOne({ userId: req.user._id });
    if (!rider) throw new ApiError(404, "Rider profile not found");

    let imageUrl;
    switch (docType) {
        case 'pan':
            imageUrl = rider.documents.panFront;
            break;
        case 'license':
            imageUrl = rider.documents.licenseFront;
            break;
        case 'rc':
            imageUrl = rider.documents.rcFront;
            break;
        default:
            throw new ApiError(400, "Invalid document type");
    }

    if (!imageUrl) throw new ApiError(400, `Please upload ${docType} photo first`);

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

    const isMatch = profileMatch && isAuthentic && fraudScore === 0 && hologramValid && signatureValid;

    if (!isMatch) {
        rider.verificationStatus = "document_mismatch";
        if (aiResponse.forensicNote) {
            rider.verificationScores.forensicAudit.push(`[${docType.toUpperCase()} FAIL] ${aiResponse.forensicNote}`);
        }
        await rider.save();
        throw new ApiError(400, `Verification failed: Data doesn't match your profile or card is fabricated.`);
    }

    // Record forensic success
    rider.verificationScores.aiFraudScore = Math.max(rider.verificationScores.aiFraudScore, fraudScore);
    if (aiResponse.forensicNote) {
        rider.verificationScores.forensicAudit.push(`[${docType.toUpperCase()} PASS] ${aiResponse.forensicNote}`);
    }

    // Save extracted data
    if (docType === 'pan') {
        rider.extractedData.pan = {
            panNumber: aiData.panNumber,
            fullName: aiData.fullName,
            verifiedAt: new Date()
        };
        rider.panNumber = aiData.panNumber;
    } else if (docType === 'license') {
        rider.extractedData.license = {
            licenseNumber: aiData.licenseNumber,
            fullName: aiData.fullName,
            dob: aiData.dob,
            verifiedAt: new Date()
        };
        rider.licenseNumber = aiData.licenseNumber;
    } else if (docType === 'rc') {
        rider.vehicleDetails.rcNumber = aiData.rcNumber;
        rider.vehicleDetails.vehicleNumber = aiData.vehicleNumber || aiData.rcNumber;
    }

    await rider.save();

    return res.status(200).json(
        new ApiResponse(200, { extractedData: rider.extractedData }, `${docType.toUpperCase()} verified via AI successfully`)
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
