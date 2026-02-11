import mongoose, { Schema } from "mongoose";

const disputeSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason: {
        type: String,
        required: [true, "Reason for dispute is required"],
        enum: [
            "Wrong Medicine",
            "Expired Medicine",
            "Damaged Packaging",
            "Counterfeit Suspicion",
            "Missing Items",
            "Other"
        ]
    },
    description: {
        type: String,
        required: [true, "Please provide a detailed description"],
        trim: true
    },
    evidence: [{
        type: String // Cloudinary URLs
    }],
    status: {
        type: String,
        enum: ["pending", "investigating", "resolved", "rejected"],
        default: "pending"
    },
    adminResponse: {
        type: String
    },
    resolvedAt: {
        type: Date
    }
}, { timestamps: true });

export const Dispute = mongoose.model("Dispute", disputeSchema);
