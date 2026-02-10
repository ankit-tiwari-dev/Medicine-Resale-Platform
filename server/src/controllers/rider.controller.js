import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Medicine } from "../models/medicine.model.js";
import { Rider } from "../models/rider.model.js";
import cloudinary from "../config/cloudinary.js";
// import { kycService } from "../utils/kyc.service.js";


// Helper to upload buffer to cloudinary
const uploadToCloudinary = (buffer, filename) => {
    if (process.env.NODE_ENV === 'test') {
        return Promise.resolve(`https://res.cloudinary.com/test/rider-proof/upload/${filename}`);
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "rider-proofs",
                public_id: `proof_${Date.now()}_${filename}`,
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

export const getMyTasks = asyncHandler(async (req, res) => {
    const { history } = req.query;
    const filter = { riderId: req.user._id };

    if (history === 'true') {
        filter.status = { $in: ['collected', 'listed', 'sold'] };
    } else {
        filter.status = 'pickup_assigned';
    }

    const medicines = await Medicine.find(filter).populate("sellerId", "name email phone address");

    return res.status(200).json(
        new ApiResponse(200, medicines, "Assigned tasks fetched successfully")
    );
});

export const confirmCollection = asyncHandler(async (req, res) => {
    const { medicineId } = req.body;

    if (!req.file) {
        throw new ApiError(400, "Proof of collection image is required");
    }

    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }

    if (medicine.riderId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not assigned to this medicine");
    }

    const proofUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    medicine.status = 'collected';
    medicine.pickupProof = proofUrl;
    await medicine.save();

    const rider = await Rider.findOne({ userId: req.user._id });
    if (rider) {
        rider.assignedTasks = rider.assignedTasks.filter(id => id.toString() !== medicineId.toString());
        rider.completedTasks.push(medicineId);
        await rider.save();
    }

    return res.status(200).json(
        new ApiResponse(200, medicine, "Collection confirmed successfully")
    );
});

export const getRiderStats = asyncHandler(async (req, res) => {
    const totalCollected = await Medicine.countDocuments({
        riderId: req.user._id,
        status: 'collected'
    });

    const pendingPickups = await Medicine.countDocuments({
        riderId: req.user._id,
        status: 'pickup_assigned'
    });

    return res.status(200).json(
        new ApiResponse(200, { totalCollected, pendingPickups }, "Rider stats fetched successfully")
    );
});



