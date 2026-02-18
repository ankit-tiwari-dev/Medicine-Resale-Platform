import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
    const { orderId, medicineId, rating, comment } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.buyerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the buyer can review purchased items");
    }

    if (order.status !== "delivered") {
        throw new ApiError(400, "Items can only be reviewed after delivery");
    }

    if (order.disputeStatus !== "none") {
        throw new ApiError(400, "Cannot add review for disputed orders");
    }

    const orderItem = order.orderItems.find(item => item.medicineId.toString() === medicineId.toString());
    if (!orderItem) {
        throw new ApiError(404, "Medicine not found in this order");
    }

    if (orderItem.isReviewed) {
        throw new ApiError(400, "You have already reviewed this item");
    }

    const review = await Review.create({
        buyerId: req.user._id,
        sellerId: order.sellerId,
        medicineId,
        orderId,
        rating,
        comment
    });

    orderItem.isReviewed = true;
    await order.save();

    return res.status(201).json(new ApiResponse(201, review, "Review submitted successfully"));
});

export const getReviewsBySeller = asyncHandler(async (req, res) => {
    const { sellerId } = req.params;
    const reviews = await Review.find({ sellerId }).populate("buyerId", "name").populate("medicineId", "name").sort("-createdAt");

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
        : 0;

    return res.status(200).json(new ApiResponse(200, {
        reviews,
        averageRating: averageRating.toFixed(1),
        totalReviews: reviews.length
    }, "Reviews fetched successfully"));
});

export const getReviewsByMedicine = asyncHandler(async (req, res) => {
    const { medicineId } = req.params;
    const reviews = await Review.find({ medicineId }).populate("buyerId", "name").sort("-createdAt");

    return res.status(200).json(new ApiResponse(200, reviews, "Medicine reviews fetched successfully"));
});
