import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Medicine } from "../models/medicine.model.js";
import { MIN_EXPIRY_DAYS } from "../utils/constants.js";
import { uploadToCloudinary } from "../utils/cloudinary.helper.js";
import axios from "axios";

const extractMedicineDetails = async (file, forceMock = false) => {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        // Ensure forceMock behaves correctly as a strict boolean check
        if (!apiKey || forceMock === true || forceMock === "true") {
            console.log("AI Extraction: Falling back to Mock data (API Key missing or forceMock enabled)");
            return {
                name: "Mock Medicine " + Math.floor(Math.random() * 100),
                expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                batchNumber: "MOCK-BATCH",
                mrp: 100,
                isMedical: true,
                imageQuality: "clear",
                description: "Mock medicine summary for safe distribution testing.",
                rejectionReason: "",
                aiNote: forceMock ? "Manual Mock Mode" : "Groq API Key missing (Mock Fallback)"
            };
        }

        const imageBase64 = file.buffer.toString("base64");
        console.log("AI Extraction: Sending request to Qwen Vision via Groq...");

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                // Explicitly targeting the deployment model identifier string
                model: "qwen-3.6-27b",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Extract technical pharmaceutical metadata from this medicine packaging image.
                                
                                CRITICAL OCR INSTRUCTIONS:
                                1. EXPIRY DATE: Look for "EXPIRY DATE", "EXP", "Use by", or "Best Before". 
                                2. YEAR AUDIT: We are in year 2026. The expiry must be 2026 or later. 
                                3. DO NOT confuse with "MFG. DATE" which is usually earlier and in the past.
                                4. If you see format like "02/2028" or "02/28", it means February 2028.
                                5. OCR CLARITY: Distinguish '5' from '8' and '2' carefully.
                                6. Return dates in strict ISO YYYY-MM-DD format (use last day of the month if only month/year is provided).

                                FIELDS TO EXTRACT:
                                1. medicine_name (Brand Name)
                                2. generic_name
                                3. manufacturer
                                4. batch_no
                                5. expiry_date
                                6. mrp (Number only)
                                7. description (Professional 2-3 sentence consumer safety summary)
                                8. image_quality ("clear" | "blurry" | "unreadable")
                                9. is_medical (Boolean)
                                10. rejection_reason (String, if not medical)

                                Return ONLY a valid JSON object.`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${imageBase64}`,
                                },
                            },
                        ],
                    },
                ],
                response_format: { type: "json_object" },
                temperature: 0,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                timeout: 60000
            }
        );

        const extracted = response.data.choices[0].message.content;
        const data = typeof extracted === 'string' ? JSON.parse(extracted) : extracted;

        const finalData = {
            name: data.medicine_name || data["Medicine Name"] || data.name || "Unknown Medicine",
            genericName: data.generic_name || data["Generic Name"] || "N/A",
            manufacturer: data.manufacturer || "N/A",
            expiryDate: (data.expiry_date || data["Expiry Date"] || data.expiryDate)
                ? new Date(data.expiry_date || data["Expiry Date"] || data.expiryDate)
                : null,
            batchNumber: data.batch_no || data.batch_number || data["Batch Number"] || data.batchNumber || "N/A",
            mrp: Number(data.mrp || data.MRP || data["MRP"]) || 0,
            description: data.description || data.safety_description || "No description provided.",
            imageQuality: data.image_quality || "clear",
            isMedical: data.is_medical !== false,
            rejectionReason: data.rejection_reason || "",
            aiNote: "Processed via Qwen 3.6 Vision Model"
        };

        console.log("AI Extraction: Successfully processed image.");
        return finalData;

    } catch (error) {
        console.error("AI Logic Error (Groq):", error.response?.data || error.message);
        return {
            name: "Manual Entry Required",
            expiryDate: null,
            batchNumber: "N/A",
            mrp: 0,
            isMedical: true,
            imageQuality: "clear",
            description: "AI extraction failed. Please check parameters.",
            rejectionReason: "",
            aiError: error.message,
            aiNote: "AI extraction failed. Please enter details manually."
        };
    }
};

const getExpiryValidationError = (expiryDate) => {
    if (!expiryDate) return null;
    const date = new Date(expiryDate);

    if (isNaN(date.getTime())) {
        console.error(`Invalid expiry date received: ${expiryDate}`);
        return "Invalid expiry date format";
    }

    const now = new Date();
    const dateClone = new Date(date);
    dateClone.setHours(0, 0, 0, 0);

    const nowClone = new Date(now);
    nowClone.setHours(0, 0, 0, 0);

    const diffTime = dateClone.getTime() - nowClone.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    console.log(`Expiry Audit: Today is ${nowClone.toISOString()}, Expiry is ${dateClone.toISOString()}, Diff: ${diffDays} days`);

    if (diffDays < 0) return "Medicine is expired";
    if (diffDays < MIN_EXPIRY_DAYS) {
        return `Expiry must be at least ${MIN_EXPIRY_DAYS} days from today to ensure safe redistribution.`;
    }
    return null;
};

const buildPickupLocation = (user) => {
    const address = user?.address;
    if (!address) return undefined;
    const parts = [address.street, address.city, address.pincode].filter(Boolean);
    return parts.length ? parts.join(", ") : undefined;
};

export const uploadMedicine = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Medicine image is required");
    }

    const { description, forceMock, stock, extractedData: clientExtractedData } = req.body;

    const imageUrl = await uploadToCloudinary(req.file.buffer, "medicine-resale-platform", req.file.originalname);

    let extractedData;
    if (clientExtractedData) {
        try {
            extractedData = typeof clientExtractedData === 'string' ? JSON.parse(clientExtractedData) : clientExtractedData;
            console.log("AI Extraction: Validating pre-extracted data from client.");
            const rawExpiry = extractedData.expiryDate || extractedData.expiry_date || extractedData.expiry;
            if (rawExpiry) {
                extractedData.expiryDate = new Date(rawExpiry);
            }
        } catch (e) {
            console.warn("Failed to parse client extraction data, falling back to AI scan.");
        }
    }

    if (!extractedData) {
        // Enforce strict casting evaluation for form-data string inputs
        const isMockForced = forceMock === 'true' || forceMock === true;
        extractedData = await extractMedicineDetails(req.file, isMockForced);
    }

    // Business Logic Validation Block
    if (extractedData?.isMedical === false) {
        throw new ApiError(400, extractedData.rejectionReason || "Verification Alert: This product does not appear to be a medical item.");
    }

    const expiryError = getExpiryValidationError(extractedData?.expiryDate);
    if (expiryError) {
        console.error(`Upload Blocked: ${expiryError}`);
        throw new ApiError(400, expiryError);
    }

    const pickupLocation = buildPickupLocation(req.user);
    const pickupCoordinates = req.user?.address?.coordinates;

    const medicine = await Medicine.create({
        sellerId: req.user._id,
        image: imageUrl,
        extractedData,
        stock: Number(stock) || 1,
        description,
        price: (extractedData.mrp || 0) * 0.7, 
        status: 'pending', 
        pickupLocation,
        pickupCoordinates
    });

    return res.status(201).json(
        new ApiResponse(201, medicine, "Medicine uploaded and processed successfully")
    );
});

export const scanMedicineImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Image is required for AI scanning");
    }

    const { forceMock } = req.body;
    const isMockForced = forceMock === 'true' || forceMock === true;
    const extractedData = await extractMedicineDetails(req.file, isMockForced);

    // Provide immediate error fallback response structure if AI filters it out
    if (extractedData?.isMedical === false) {
        return res.status(200).json(
            new ApiResponse(200, extractedData, "Product failed pharmaceutical verification metrics.")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, extractedData, "AI Scan completed successfully")
    );
});

export const getMedicines = asyncHandler(async (req, res) => {
    const { status, search, minPrice, maxPrice, expiryAfter, sort } = req.query;
    const filter = {};

    if (status) {
        filter.status = status;
    } else {
        filter.status = 'listed';
    }

    filter.$or = [
        { reservedUntil: { $exists: false } },
        { reservedUntil: { $lte: new Date() } },
        { reservedBy: req.user?._id } 
    ];

    if (search) {
        filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (expiryAfter) {
        filter['extractedData.expiryDate'] = { $gte: new Date(expiryAfter) };
    }

    if (req.query.verified === 'true') {
        filter.adminVerified = true;
    }
    if (req.query.riderCertified === 'true') {
        filter.riderVerified = true;
    }

    let query;
    if (search) {
        query = Medicine.find(filter, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } });
    } else {
        query = Medicine.find(filter);
    }

    query = query.populate("sellerId", "name email");

    if (sort) {
        switch (sort) {
            case 'price_asc':
                query = query.sort({ price: 1 });
                break;
            case 'price_desc':
                query = query.sort({ price: -1 });
                break;
            case 'expiry':
                query = query.sort({ 'extractedData.expiryDate': 1 });
                break;
            default:
                query = query.sort({ createdAt: -1 });
        }
    } else {
        query = query.sort({ createdAt: -1 });
    }

    const medicines = await query;

    return res.status(200).json(
        new ApiResponse(200, medicines, "Medicines fetched successfully")
    );
});

export const updateMedicineDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, expiryDate, batchNumber, description, stock } = req.body;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }

    if (medicine.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "Unauthorized to update this medicine");
    }

    const lockedStatuses = ['sold', 'collected', 'pickup_assigned'];
    if (lockedStatuses.includes(medicine.status?.toLowerCase()) && req.user.role !== 'admin') {
        throw new ApiError(400, `Cannot update listing as it is currently in '${medicine.status}' status`);
    }

    if (name) medicine.extractedData.name = name;
    if (expiryDate) {
        const expiryError = getExpiryValidationError(expiryDate);
        if (expiryError) {
            throw new ApiError(400, expiryError);
        }
        medicine.extractedData.expiryDate = expiryDate;
    }
    if (batchNumber) medicine.extractedData.batchNumber = batchNumber;
    if (description) medicine.description = description;
    if (stock !== undefined) medicine.stock = Number(stock);

    if (medicine.extractedData.mrp) {
        medicine.price = (medicine.extractedData.mrp || 0) * 0.7;
    }

    if (name || expiryDate || batchNumber) {
        medicine.adminVerified = false;
        medicine.status = 'pending'; 
    }

    await medicine.save();

    return res.status(200).json(
        new ApiResponse(200, medicine, "Medicine details updated successfully")
    );
});

export const getMyMedicines = asyncHandler(async (req, res) => {
    const medicines = await Medicine.find({ sellerId: req.user._id })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, medicines, "My uploaded medicines fetched successfully")
    );
});

export const getMedicineById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const medicine = await Medicine.findById(id).populate("sellerId", "name email");

    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }

    return res.status(200).json(
        new ApiResponse(200, medicine, "Medicine details fetched successfully")
    );
});

export const deleteMedicine = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }

    if (medicine.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "Unauthorized to delete this listing");
    }

    const lockedStatuses = ['sold', 'collected', 'pickup_assigned'];
    if (lockedStatuses.includes(medicine.status?.toLowerCase()) && req.user.role !== 'admin') {
        throw new ApiError(400, `Cannot delete a listing that is ${medicine.status}`);
    }

    await Medicine.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Medicine listing removed successfully")
    );
});
