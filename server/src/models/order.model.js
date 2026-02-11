import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        orderItems: [
            {
                medicineId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Medicine",
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                isReviewed: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        amount: Number,
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled", "disputed"],
            default: "pending"
        },
        disputeStatus: {
            type: String,
            enum: ["none", "pending", "investigating", "resolved", "rejected"],
            default: "none"
        },
        disputeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dispute"
        },
        shippingAddress: String,
        razorpayOrderId: {
            type: String
        },
        razorpayPaymentId: {
            type: String
        },
        razorpaySignature: {
            type: String
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending"
        },
        deliveredAt: {
            type: Date
        },
        shippedAt: {
            type: Date
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: ["pending", "paid", "shipped", "delivered", "cancelled", "disputed"],
                    required: true
                },
                at: {
                    type: Date,
                    default: Date.now
                },
                by: {
                    type: String,
                    default: "system"
                }
            }
        ],
    },
    {
        timestamps: true
    }
);

export const Order = mongoose.model("Order", orderSchema);
