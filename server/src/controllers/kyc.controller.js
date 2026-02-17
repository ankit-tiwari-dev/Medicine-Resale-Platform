import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rider } from "../models/rider.model.js";
import OCRService from "../utils/ocr.service.js";
import { uploadToCloudinary } from "../utils/cloudinary.helper.js";

const sanitizeName = (name) => {
    if (!name) return "";
    return name
        .replace(/\b(Male|Female|Man|Woman|S\/O|D\/O|W\/O|Mr|Mrs|Ms|Sri|Shri|Late)\b/gi, "")
        .replace(/[^a-zA-Z\s]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();
};




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
    const aiResponse = await OCRService.groqIdentify(rider.documents.aadharFront, "AADHAAR", req.user.name);
    if (!aiResponse) throw new ApiError(400, "Failed to analyze Aadhaar image. Please ensure the photo is clear.");

    const aiData = aiResponse.data;
    const fraudScore = aiResponse.fraudScore || 0;
    const forensics = aiResponse.forensics || {};

    // Security check: 40/60 Decision Matrix
    const isAuthentic = aiResponse.isAuthentic !== false;
    // Hard reject if fraud > 60 or AI explicitly says not authentic
    const definitelyFake = fraudScore > 60 || !isAuthentic;
    // Soft reject if fraud > 40 UNLESS physicality is HIGH (Trust-Physicality)
    const highRisk = fraudScore > 40 && forensics.physicalityConfidence !== 'HIGH';
    const weakHologram = forensics.hologramConfidence === 'LOW' && forensics.physicalityConfidence === 'LOW';

    // Profile Matching: Ensure name matches
    const userNames = sanitizeName(req.user.name).toLowerCase().split(" ").filter(n => n.length > 2);
    const extractedName = sanitizeName(aiData.fullName).toLowerCase();
    const profileMatch = userNames.some(namePart => extractedName.includes(namePart));

    const isMatch = profileMatch && !definitelyFake && !highRisk && !weakHologram;

    // Data Sanitization: Use the AI-extracted name (sanitized)
    const finalName = extractedName.toUpperCase();

    if (!isMatch) {
        rider.verificationStatus = "document_mismatch";
        const reason = aiResponse.forensicNote || "Aadhaar verification failed. Name mismatch or forgery detected.";
        if (aiResponse.forensicNote) {
            rider.verificationScores.forensicAudit.push(`[AADHAAR FAIL] ${aiResponse.forensicNote}`);
        }
        await rider.save();
        throw new ApiError(400, `Verification failed: ${reason}`);
    }

    // Map extracted data to model
    rider.extractedData.aadhar = {
        fullName: finalName,
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

    const aiResponse = await OCRService.groqIdentify(imageUrl, docType.toUpperCase(), req.user.name);
    if (!aiResponse) throw new ApiError(400, `Failed to analyze ${docType} image. Please ensure the photo is clear.`);

    const aiData = aiResponse.data;
    const fraudScore = aiResponse.fraudScore || 0;
    const forensics = aiResponse.forensics || {};

    // Security check: 40/60 Decision Matrix
    const isAuthentic = aiResponse.isAuthentic !== false;
    // Hard reject if fraud > 60
    const definitelyFake = fraudScore > 60 || !isAuthentic;
    // Soft reject if fraud > 40 UNLESS physicality or signature is HIGH
    const highRisk = fraudScore > 40 && forensics.physicalityConfidence !== 'HIGH' && forensics.signatureConfidence !== 'HIGH';
    const weakHologram = forensics.hologramConfidence === 'LOW' && forensics.physicalityConfidence === 'LOW' && forensics.signatureConfidence === 'LOW';

    // Profile Matching: Use explicit fullName from new prompt
    const userNames = sanitizeName(req.user.name).toLowerCase().split(" ").filter(n => n.length > 2);
    const extractedName = sanitizeName(aiData.fullName).toLowerCase();
    const profileMatch = userNames.some(namePart => extractedName.includes(namePart));

    const isMatch = profileMatch && !definitelyFake && !highRisk && !weakHologram;

    // Data Sanitization: Use the AI-extracted name (sanitized)
    const finalName = extractedName.toUpperCase();

    console.log("KYC_DIAG_REFINED:", {
        docType,
        profileMatch,
        definitelyFake,
        weakHologram,
        fraudScore,
        extractedName,
        expectedName: req.user.name
    });

    if (!isMatch) {
        rider.verificationStatus = "document_mismatch";
        const reason = aiResponse.forensicNote || "Data doesn't match your profile or card is fabricated.";
        if (aiResponse.forensicNote) {
            rider.verificationScores.forensicAudit.push(`[${docType.toUpperCase()} FAIL] ${aiResponse.forensicNote}`);
        }
        await rider.save();
        throw new ApiError(400, `Verification failed: ${reason}`);
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
            fullName: finalName,
            verifiedAt: new Date()
        };
        rider.panNumber = aiData.panNumber;
    } else if (docType === 'license') {
        rider.extractedData.license = {
            licenseNumber: aiData.licenseNumber,
            fullName: finalName,
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
        const aiResponse = await OCRService.groqIdentify(rider.documents.insuranceFront, 'INSURANCE');

        // Security check: 40/60 Decision Matrix
        const fraudScore = aiResponse.fraudScore || 0;
        const forensics = aiResponse.forensics || {};
        const isAuthentic = aiResponse.isAuthentic !== false;

        const definitelyFake = fraudScore > 60 || !isAuthentic;
        // For Paper Docs (Insurance), MEDIUM is acceptable. Only reject if LOW.
        const highRisk = fraudScore > 40 && forensics.physicalityConfidence === 'LOW';

        if (aiResponse && !definitelyFake && !highRisk) {
            const insuranceData = aiResponse.data;
            rider.insurance = {
                policyNumber: insuranceData.policyNumber,
                expiryDate: new Date(insuranceData.expiryDate),
                isVerified: false
            };
            results.insurance = "extracted_verified";
            if (aiResponse.forensicNote) {
                rider.verificationScores.forensicAudit.push(`[INSURANCE PASS] ${aiResponse.forensicNote}`);
            }
        } else {
            results.insurance = "rejected_forgery";
            if (aiResponse?.forensicNote) {
                rider.verificationScores.forensicAudit.push(`[INSURANCE FAIL] ${aiResponse.forensicNote}`);
            }
        }
    }

    if (rider.documents.bankProof) {
        // Pass expected name for bank account matching
        const aiResponse = await OCRService.groqIdentify(rider.documents.bankProof, 'BANK', req.user.name);

        // Security check: 40/60 Decision Matrix
        const fraudScore = aiResponse.fraudScore || 0;
        const forensics = aiResponse.forensics || {};
        const isAuthentic = aiResponse.isAuthentic !== false;

        const definitelyFake = fraudScore > 60 || !isAuthentic;
        // For Paper Docs (Bank), MEDIUM is acceptable. Only reject if LOW.
        const highRisk = fraudScore > 40 && forensics.physicalityConfidence === 'LOW';

        if (aiResponse && !definitelyFake && !highRisk) {
            const bankData = aiResponse.data;
            rider.bankDetails = {
                accountNumber: bankData.accountNumber,
                ifsc: bankData.ifsc,
                bankName: bankData.bankName,
                holderName: bankData.holderName,
                isVerified: false
            };
            results.bank = "extracted_verified";
            if (aiResponse.forensicNote) {
                rider.verificationScores.forensicAudit.push(`[BANK PASS] ${aiResponse.forensicNote}`);
            }
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
