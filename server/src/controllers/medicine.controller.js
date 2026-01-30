import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Medicine } from "../models/medicine.model.js";
import cloudinary from "../config/cloudinary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const extractMedicineDetails = async (files, forceMock = false) => {
    try {
        // 1. Check for manual mock or missing key
        if (!process.env.GEMINI_API_KEY || forceMock) {
            return {
                name: "Mock Medicine " + Math.floor(Math.random() * 100),
                expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                batchNumber: "MOCK-BATCH",
                mrp: 100,
                aiNote: "Manual Mock Mode"
            };
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const prompt = `Extract medicine details from image. Return ONLY JSON: {"name": "string", "expiryDate": "YYYY-MM-DD", "batchNumber": "string", "mrp": number}`;
        // 1. Verified Model Names from API Check
        const modelsToTry = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-2.5-flash"];

        // 2. Add a helper for cleaner JSON parsing
        const extractJson = (text) => {
            try {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
            } catch (e) {
                return null;
            }
        };

        let result = null;
        let lastError = null;

        const file = files[0];

        for (const modelName of modelsToTry) {
            try {
                // console.log(`Attempting AI extraction with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                result = await model.generateContent([
                    prompt,
                    { inlineData: { data: file.buffer.toString("base64"), mimeType: file.mimetype } }
                ]);

                if (result) break;
            } catch (err) {
                lastError = err;
                if (err.message.includes("429")) {
                    console.warn(`Quota exceeded for ${modelName}. Trying next model...`);
                } else {
                    console.warn(`Model ${modelName} failed:`, err.message);
                }
            }
        }

        // 3. Graceful Fallback instead of throwing a hard Error
        if (!result) {
            console.error("ALL AI MODELS FAILED OR QUOTA EXCEEDED");
            return {
                name: "Pending Verification",
                expiryDate: null,
                batchNumber: "MANUAL_ENTRY_REQUIRED",
                mrp: 0,
                aiNote: "AI Quota exceeded. Please enter details manually."
            };
        }

        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim();
        const extracted = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));

        return {
            name: extracted.name || "Unknown Medicine",
            expiryDate: extracted.expiryDate ? new Date(extracted.expiryDate) : null,
            batchNumber: extracted.batchNumber || "N/A",
            mrp: Number(extracted.mrp) || 0,
            aiNote: "Successfully extracted"
        };

    } catch (error) {
        console.error("AI Logic Error:", error.message);
        return { name: "Manual Entry", expiryDate: null, batchNumber: "N/A", mrp: 0, aiError: error.message };
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

    const medicine = await Medicine.create({
        sellerId: req.user._id,
        images: imageUrls,
        extractedData,
        description,
        price: (extractedData.mrp || 0) * 0.8,
        status: 'uploaded'
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

    // Search by medicine name (case-insensitive)
    if (search) {
        filter['extractedData.name'] = { $regex: search, $options: 'i' };
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
    let query = Medicine.find(filter).populate("sellerId", "name email");

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
    if (expiryDate) medicine.extractedData.expiryDate = expiryDate;
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