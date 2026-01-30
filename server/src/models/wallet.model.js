import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        balance: {
            type: Number,
            default: 0
        },
        transactions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }],
    },
    {
        timestamps: true
    }
);

export const Wallet = mongoose.model("Wallet", walletSchema);