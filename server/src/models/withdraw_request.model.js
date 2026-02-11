import mongoose from "mongoose";

const withdrawRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "processed"],
            default: "pending"
        },
        bankDetails: {
            accountNumber: String,
            ifsc: String,
            bankName: String,
            accountHolderName: String
        },
        adminComment: String,
        processedAt: Date,
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

export const WithdrawRequest = mongoose.model("WithdrawRequest", withdrawRequestSchema);
