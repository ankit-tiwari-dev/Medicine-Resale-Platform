import { Dispute } from "../models/dispute.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";

// Helper to upload buffer to cloudinary
const uploadToCloudinary = (buffer, folder, filename) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, public_id: filename },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

export const createDispute = asyncHandler(async (req, res) => {
    const { orderId, reason, description } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.buyerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the buyer can open a dispute");
    }

    if (order.status !== "delivered") {
        throw new ApiError(400, "Disputes can only be opened for delivered orders");
    }

    if (order.disputeStatus !== "none") {
        throw new ApiError(400, "A dispute is already open for this order");
    }

    const evidenceUrls = [];
    if (req.files && req.files.evidence) {
        for (const file of req.files.evidence) {
            const result = await uploadToCloudinary(file.buffer, "disputes", `dispute_${orderId}_${Date.now()}`);
            evidenceUrls.push(result.secure_url);
        }
    }

    const dispute = await Dispute.create({
        orderId,
        buyerId: req.user._id,
        sellerId: order.sellerId,
        reason,
        description,
        evidence: evidenceUrls
    });

    order.status = "disputed";
    order.disputeStatus = "pending";
    order.disputeId = dispute._id;
    await order.save();

    return res.status(201).json(new ApiResponse(201, dispute, "Dispute raised successfully"));
});

export const getDisputes = asyncHandler(async (req, res) => {
    const query = {};
    if (req.user.role === "admin") {
        // Admin sees all
    } else if (req.user.role === "rider") {
        throw new ApiError(403, "Riders cannot access disputes");
    } else {
        // User sees their disputes (as buyer or seller)
        query.$or = [{ buyerId: req.user._id }, { sellerId: req.user._id }];
    }

    const disputes = await Dispute.find(query).populate("orderId").sort("-createdAt");
    return res.status(200).json(new ApiResponse(200, disputes, "Disputes fetched successfully"));
});

export const resolveDispute = asyncHandler(async (req, res) => {
    const { disputeId } = req.params;
    const { status, adminResponse } = req.body; // status: resolved, rejected

    if (req.user.role !== "admin") throw new ApiError(403, "Only admins can resolve disputes");

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) throw new ApiError(404, "Dispute not found");

    dispute.status = status;
    dispute.adminResponse = adminResponse;
    dispute.resolvedAt = new Date();
    await dispute.save();

    const order = await Order.findById(dispute.orderId);
    order.disputeStatus = status;
    if (status === "rejected") {
        order.status = "delivered"; // Return to delivered if rejected
    }
    await order.save();

    return res.status(200).json(new ApiResponse(200, dispute, `Dispute ${status} successfully`));
});
