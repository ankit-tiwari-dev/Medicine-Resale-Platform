import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Medicine } from "../models/medicine.model.js";
import { MIN_EXPIRY_DAYS } from "../constants.js";
import cloudinary from "../config/cloudinary.js";
import axios from "axios";

/*
const extractMedicineDetailsKaggle = async (files, forceMock = false) => {
    try {
        const rawUrl = process.env.KAGGLE_TUNNEL_URL?.trim();

        // 1. Check for manual mock or missing URL
        if (!rawUrl || forceMock) {
            console.log("AI Extraction: Falling back to Mock data (URL missing or forceMock enabled)");
            return {
                name: "Mock Medicine " + Math.floor(Math.random() * 100),
                expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                batchNumber: "MOCK-BATCH",
                mrp: 100,
                aiNote: forceMock ? "Manual Mock Mode" : "Kaggle Tunnel URL missing (Mock Fallback)"
            };
        }

        const file = files[0];
        const imageBase64 = file.buffer.toString("base64");

        // Clean the tunnel URL
        const baseUrl = rawUrl.replace(/\/api\/chat\/?$/, "").replace(/\/$/, "");
        console.log("AI Extraction: Base URL used for Axios:", baseUrl);

        console.log("AI Extraction: Sending request to Kaggle (Localtunnel + Ollama)...");

        const response = await axios.post(`${baseUrl}/api/chat`, {
            model: "llama3.2-vision:11b",
            messages: [{
                role: "user",
                content: `Persona: You are a professional pharmaceutical OCR scanner.
        Task: Extract data from the provided medicine label.
        Rules:
        1. Locate the 'Medicine Name' (usually the largest text).
        2. Find 'Batch No' or 'Lot No'.
        3. Find 'Expiry Date' or 'EXP'.
        4. Find 'MRP' or 'Price'.
        5. If text is blurry, look for date patterns (MM/YYYY or DD/MM/YY).
        6. Return ONLY a JSON object. No conversation. No markdown blocks.
        
        Expected Format:
        {"medicine_name": "", "batch_no": "", "expiry_date": "YYYY-MM-DD", "mrp": 0.0}`,
                images: [imageBase64]
            }],
            stream: false,
            format: "json",
            options: {
                temperature: 0,
                num_ctx: 2048
            }
        }, {
            headers: { 'bypass-tunnel-reminder': 'true' },
            timeout: 120000
        });

        const aiContent = response.data.message.content;
        const extracted = typeof aiContent === 'string' ? JSON.parse(aiContent) : aiContent;

        const finalData = {
            name: extracted.medicine_name || extracted["Medicine Name"] || extracted.name || "Unknown Medicine",

            expiryDate: (extracted.expiry_date || extracted["Expiry Date"] || extracted.expiryDate)
                ? new Date(extracted.expiry_date || extracted["Expiry Date"] || extracted.expiryDate)
                : null,

            batchNumber: extracted.batch_no || extracted["Batch Number"] || extracted.batchNumber || "N/A",

            mrp: Number(extracted.mrp || extracted.MRP || extracted["MRP"]) || 0,

            aiNote: "Processed via Llama 3.2-Vision"
        };

        console.log("AI Extraction: Successfully processed image.");
        return finalData;

    } catch (error) {
        console.error("AI Logic Error (Llama/Localtunnel):", error.response?.data || error.message);
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
*/

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


const uploadToCloudinary = (buffer, filename) => {
    if (process.env.NODE_ENV === 'test') {
        return Promise.resolve(`https://res.cloudinary.com/test/image/upload/${filename}`);
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "medicine-resale-platform",
                public_id: `medicine_${Date.now()}_${filename}`,
                resource_type: "image"
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
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
        uploadToCloudinary(file.buffer, file.originalname)
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
