import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Medicine } from "../models/medicine.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const maskValue = (value = "", keep = 6) => {
    if (!value || typeof value !== "string") return "N/A";
    if (value.length <= keep * 2) return `${value.slice(0, 2)}...${value.slice(-2)}`;
    return `${value.slice(0, keep)}...${value.slice(-keep)}`;
};

export const createPaymentOrder = asyncHandler(async (req, res) => {
    const { orderId, currency = "INR" } = req.body;

    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    const orderRecord = await Order.findById(orderId);
    if (!orderRecord) {
        throw new ApiError(404, "Order not found");
    }

    if (orderRecord.buyerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to pay for this order");
    }

    // Validate order amount
    if (!orderRecord.amount || isNaN(orderRecord.amount) || orderRecord.amount <= 0) {
        throw new ApiError(400, "Invalid order amount");
    }

    const options = {
        amount: Math.round(orderRecord.amount * 100), // amount in the smallest currency unit (paise)
        currency,
        receipt: `${orderId}_${Date.now()}`.substring(0, 40) // Ensure it doesn't exceed 40 chars
    };

    try {
        if (process.env.NODE_ENV === 'test') {
            orderRecord.razorpayOrderId = "test_order_id";
            await orderRecord.save();
            return res.status(200).json(
                new ApiResponse(200, { id: "test_order_id", amount: options.amount }, "Payment order created successfully")
            );
        }
        const razorpayOrder = await razorpay.orders.create(options);

        // Bind Razorpay Order ID to DB Order
        orderRecord.razorpayOrderId = razorpayOrder.id;
        await orderRecord.save();

        return res.status(200).json(
            new ApiResponse(200, razorpayOrder, "Payment order created successfully")
        );
    } catch (error) {
        console.error("Razorpay Error:", JSON.stringify(error, null, 2));
        const errorMessage = error.error?.description || error.message || "Unknown Razorpay error";
        throw new ApiError(500, "Could not create Razorpay order: " + errorMessage);
    }
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_db_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ApiError(400, "All payment details are required");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        // Debug-only signal for local troubleshooting; does not expose full signature.
        console.warn("[PAYMENT_VERIFY] Signature mismatch", {
            orderDbId: order_db_id || "N/A",
            razorpayOrderId: razorpay_order_id || "N/A",
            razorpayPaymentId: razorpay_payment_id || "N/A",
            providedSignature: maskValue(razorpay_signature),
            expectedSignature: maskValue(expectedSignature)
        });
        throw new ApiError(400, "Invalid payment signature");
    }

    if (!order_db_id) {
        throw new ApiError(400, "order_db_id is required for verification");
    }

    const order = await Order.findOne({
        _id: order_db_id,
        buyerId: req.user._id
    });

    if (!order) {
        throw new ApiError(404, "Order not found or unauthorized");
    }

    // --- CRITICAL SECURITY CHECK ---
    if (order.razorpayOrderId !== razorpay_order_id) {
        throw new ApiError(400, "Payment signature does not match this internal order");
    }

    // Idempotency guard: repeated callbacks should not mutate order repeatedly.
    if (order.paymentStatus === "completed") {
        return res.status(200).json(
            new ApiResponse(200, { success: true, alreadyVerified: true }, "Payment already verified")
        );
    }

    // Wrap order + medicine updates in a transaction for atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        order.paymentStatus = 'completed';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        if (order.status === "pending") {
            order.status = "paid";
        }
        const hasPaidHistory = (order.statusHistory || []).some((entry) => entry.status === "paid");
        if (!hasPaidHistory) {
            order.statusHistory.push({
                status: 'paid',
                at: new Date(),
                by: 'payment'
            });
        }
        await order.save({ session });

        // Now officially mark medicines as sold
        for (const item of order.orderItems) {
            await Medicine.findByIdAndUpdate(
                item.medicineId,
                {
                    $set: {
                        status: "sold",
                        buyerId: req.user._id,
                        paymentStatus: "completed"
                    },
                    $unset: {
                        reservedBy: 1,
                        reservedUntil: 1
                    }
                },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json(
            new ApiResponse(200, { success: true }, "Payment verified successfully")
        );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});
