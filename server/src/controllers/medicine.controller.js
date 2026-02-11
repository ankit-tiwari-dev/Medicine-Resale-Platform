import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Medicine } from "../models/medicine.model.js";
import { MIN_EXPIRY_DAYS } from "../constants.js";

import { uploadToCloudinary } from "../utils/cloudinary.helper.js";
import axios from "axios";



const extractMedicineDetails = async (files, forceMock = false) => {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey || forceMock) {
            console.log("AI Extraction: Falling back to Mock data (API Key missing or forceMock enabled)");
            return {
                name: "Mock Medicine " + Math.floor(Math.random() * 100),
                expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                batchNumber: "MOCK-BATCH",
                mrp: 100,
                aiNote: forceMock ? "Manual Mock Mode" : "Groq API Key missing (Mock Fallback)"
            };
        }

        const file = files[0];
        const imageBase64 = file.buffer.toString("base64");

        console.log("AI Extraction: Sending request to Groq Llama 3.2 Vision...");

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Extract Medicine Name, Batch Number, Expiry Date (YYYY-MM-DD), and MRP into a JSON object. Return ONLY JSON."
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
            expiryDate: (data.expiry_date || data["Expiry Date"] || data.expiryDate)
                ? new Date(data.expiry_date || data["Expiry Date"] || data.expiryDate)
                : null,
            batchNumber: data.batch_no || data.batch_number || data["Batch Number"] || data.batchNumber || "N/A",
            mrp: Number(data.mrp || data.MRP || data["MRP"]) || 0,
            aiNote: "Processed via Groq Llama 3.2 Vision"
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
            aiError: error.message,
            aiNote: "AI extraction failed. Please enter details manually."
        };
    }
};




const getExpiryValidationError = (expiryDate) => {
    if (!expiryDate) return null;
    const date = new Date(expiryDate);
    if (Number.isNaN(date.getTime())) {
        return "Invalid expiry date format";
    }
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Medicine is expired";
    if (diffDays < MIN_EXPIRY_DAYS) {
        return `Expiry must be at least ${MIN_EXPIRY_DAYS} days from today`;
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
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one medicine image is required");
    }

    const { description, forceMock } = req.body;

    const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, "medicine-resale-platform", file.originalname)
    );

    const imageUrls = await Promise.all(uploadPromises);

    const extractedData = await extractMedicineDetails(req.files, forceMock === 'true' || forceMock === true);

    const expiryError = getExpiryValidationError(extractedData?.expiryDate);
    if (expiryError) {
        throw new ApiError(400, expiryError);
    }

    const pickupLocation = buildPickupLocation(req.user);
    const pickupCoordinates = req.user?.address?.coordinates;

    const medicine = await Medicine.create({
        sellerId: req.user._id,
        images: imageUrls,
        extractedData,
        description,
        price: (extractedData.mrp || 0) * 0.8,
        status: 'uploaded',
        pickupLocation,
        pickupCoordinates
    });

    return res.status(201).json(
        new ApiResponse(201, medicine, "Medicine uploaded and processed successfully")
    );
});

export const getMedicines = asyncHandler(async (req, res) => {
    const { status, search, minPrice, maxPrice, expiryAfter, sort } = req.query;
    const filter = {};

    // Status filter
    if (status) {
        filter.status = status;
    } else {
        filter.status = 'listed';
    }

    // Exclude reserved items (if reserved by someone else and reservation hasn't expired)
    filter.$or = [
        { reservedUntil: { $exists: false } },
        { reservedUntil: { $lte: new Date() } },
        { reservedBy: req.user?._id } // Allow the person who reserved it to still see/buy it
    ];

    // Search by medicine name (using Text Index for fuzzy match)
    if (search) {
        filter.$text = { $search: search };
    }

    // Price range filter
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Expiry date filter (medicines expiring after specified date)
    if (expiryAfter) {
        filter['extractedData.expiryDate'] = { $gte: new Date(expiryAfter) };
    }

    // Build query
    let query;
    if (search) {
        // Sort by text search score if searching
        query = Medicine.find(filter, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } });
    } else {
        query = Medicine.find(filter);
    }

    query = query.populate("sellerId", "name email");

    // Sorting
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
    const { name, expiryDate, batchNumber, price, description } = req.body;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }

    if (medicine.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "Unauthorized to update this medicine");
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
    if (price) medicine.price = price;
    if (description) medicine.description = description;

    if (name || expiryDate || batchNumber) {
        medicine.adminVerified = false;
        medicine.status = 'uploaded';
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
