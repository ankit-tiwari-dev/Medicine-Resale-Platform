import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createPaymentOrder = asyncHandler(async (req, res) => {
    const { amount, currency = "INR" } = req.body;

    if (!amount) {
        throw new ApiError(400, "Amount is required");
    }

    const options = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
        currency,
        receipt: `receipt_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);

        return res.status(200).json(
            new ApiResponse(200, order, "Payment order created successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Could not create Razorpay order: " + error.message);
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

    if (isAuthentic) {
        // If we have specific DB IDs passed, use them.
        // OR better, finding orders by razorpayOrderId is safer if we saved it during creation?
        // But we generate Razorpay Order BEFORE DB Order usually in this flow?
        // Actually, flow is: 1. Create Razorpay Order -> 2. Frontend Payment -> 3. Create DB Order?
        // OR 1. Create DB Order (Pending) -> 2. Create Razorpay Order -> 3. Pay -> 4. Verify.
        // The current implementation of `payment.controller.js` creates purely a generic Razorpay order.
        // The `createOrder` (DB) happens separately.
        // So the user must have sent `order_db_id` (or IDs) to `verify`.

        // Let's support array of order_db_ids or single
        let orderIds = [];
        if (req.body.order_db_ids && Array.isArray(req.body.order_db_ids)) {
            orderIds = req.body.order_db_ids;
        } else if (order_db_id) {
            orderIds = [order_db_id];
        }

        if (orderIds.length > 0) {
            await Order.updateMany(
                { _id: { $in: orderIds } },
                {
                    $set: {
                        paymentStatus: 'completed',
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id,
                        razorpaySignature: razorpay_signature,
                        status: 'paid'
                    }
                }
            );
        }

        return res.status(200).json(
            new ApiResponse(200, { success: true }, "Payment verified successfully")
        );
    } else {
        throw new ApiError(400, "Invalid payment signature");
    }
});
