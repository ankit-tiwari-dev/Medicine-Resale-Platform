import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Medicine } from "../models/medicine.model.js";
import { Rider } from "../models/rider.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.helper.js";
// import { kycService } from "../utils/kyc.service.js";




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

    const proofUrl = await uploadToCloudinary(req.file.buffer, "rider-proofs", req.file.originalname);

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
    const rider = await Rider.findOne({ userId: req.user._id });

    if (!rider) {
        throw new ApiError(404, "Rider profile not found");
    }

    const totalCollected = await Medicine.countDocuments({
        riderId: req.user._id,
        status: 'collected'
    });

    const pendingPickups = await Medicine.countDocuments({
        riderId: req.user._id,
        status: 'pickup_assigned'
    });

    return res.status(200).json(
        new ApiResponse(200, {
            totalCollected,
            pendingPickups,
            earnings: rider.earnings,
            isActive: rider.isActive,
            trustScore: rider.verificationScores?.overall || 0,
            verificationStatus: rider.verificationStatus
        }, "Rider stats fetched successfully")
    );
});

export const updateDutyStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body;

    const rider = await Rider.findOneAndUpdate(
        { userId: req.user._id },
        { $set: { isActive } },
        { new: true }
    );

    if (!rider) {
        throw new ApiError(404, "Rider profile not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { isActive: rider.isActive }, "Duty status updated successfully")
    );
});



