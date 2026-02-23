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
                                text: `Extract the following details from the medicine packaging image if it is a medical product (medicine, tablets, syrup, etc.):
                                1. medicine_name (Brand Name)
                                2. generic_name
                                3. manufacturer
                                4. batch_no
                                5. expiry_date (ISO format YYYY-MM-DD)
                                6. mrp (Number)
                                7. description (A 2-3 sentence summary for consumers including usage, dosage form, and key safety warnings found on the packaging)
                                8. image_quality (Enum: "clear", "blurry", "unreadable" - based on how well text can be extracted)
                                9. is_medical (Boolean - true if it's a pharmaceutical/medical product, false otherwise)
                                10. rejection_reason (String - if is_medical is false, explain why in a professional manner, otherwise leave empty)

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
    if (!req.file) {
        throw new ApiError(400, "Medicine image is required");
    }

    const { description, forceMock, stock } = req.body;

    const imageUrl = await uploadToCloudinary(req.file.buffer, "medicine-resale-platform", req.file.originalname);

    const extractedData = await extractMedicineDetails(req.file, forceMock === 'true' || forceMock === true);

    const expiryError = getExpiryValidationError(extractedData?.expiryDate);
    if (expiryError) {
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
        price: (extractedData.mrp || 0) * 0.8,
        status: 'uploaded',
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
    const extractedData = await extractMedicineDetails(req.file, forceMock === 'true' || forceMock === true);

    return res.status(200).json(
        new ApiResponse(200, extractedData, "AI Scan completed successfully")
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
    const { name, expiryDate, batchNumber, price, description, stock } = req.body;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }

    if (medicine.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "Unauthorized to update this medicine");
    }

    // Strict Protection: Block updates if status is locked
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
    if (price) medicine.price = price;
    if (description) medicine.description = description;
    if (stock !== undefined) medicine.stock = Number(stock);

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

export const deleteMedicine = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }

    // Authorization check
    if (medicine.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "Unauthorized to delete this listing");
    }

    // Strict Protection: block deletion if medicine is SOLD, COLLECTED or PICKUP_ASSIGNED
    const lockedStatuses = ['sold', 'collected', 'pickup_assigned'];
    if (lockedStatuses.includes(medicine.status?.toLowerCase()) && req.user.role !== 'admin') {
        throw new ApiError(400, `Cannot delete a listing that is ${medicine.status}`);
    }

    await Medicine.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Medicine listing removed successfully")
    );
});
