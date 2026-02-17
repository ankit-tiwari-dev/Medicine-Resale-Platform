import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wallet } from "../models/wallet.model.js";
import { WithdrawRequest } from "../models/withdraw_request.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Rider } from "../models/rider.model.js";

// Helper to get or create wallet
const getOrCreateWallet = async (userId) => {
    return await Wallet.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, balance: 0, transactions: [] } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

export const getWalletBalance = asyncHandler(async (req, res) => {
    const wallet = await getOrCreateWallet(req.user._id);
    return res.status(200).json(
        new ApiResponse(200, wallet, "Wallet balance fetched successfully")
    );
});

export const getTransactions = asyncHandler(async (req, res) => {
    const wallet = await getOrCreateWallet(req.user._id);

    await wallet.populate({
        path: 'transactions',
        options: { sort: { createdAt: -1 } }
    });

    return res.status(200).json(
        new ApiResponse(200, wallet.transactions, "Transactions fetched successfully")
    );
});

export const requestWithdrawal = asyncHandler(async (req, res) => {
    let { amount, bankDetails } = req.body;

    // --- Payout Security Lock ---
    if (req.user.role === "rider") {
        const rider = await Rider.findOne({ userId: req.user._id });
        if (!rider || !rider.bankDetails || !rider.bankDetails.isVerified) {
            throw new ApiError(403, "Withdrawals are locked until your bank details are verified by an Admin.");
        }
        // Force the use of the pre-verified bank details
        bankDetails = {
            accountNumber: rider.bankDetails.accountNumber,
            ifsc: rider.bankDetails.ifsc,
            bankName: rider.bankDetails.bankName,
            holderName: rider.bankDetails.holderName
        };
    }

    if (!amount || amount <= 0) {
        throw new ApiError(400, "Amount must be greater than zero");
    }

    // Atomic balance deduction — prevents double-spend race condition
    const wallet = await Wallet.findOneAndUpdate(
        { userId: req.user._id, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { new: true }
    );

    if (!wallet) {
        // Either wallet doesn't exist or insufficient balance
        const existingWallet = await getOrCreateWallet(req.user._id);
        if (existingWallet.balance < amount) {
            throw new ApiError(400, "Insufficient balance");
        }
        throw new ApiError(500, "Withdrawal failed, please try again");
    }

    // Create withdraw request
    const withdrawRequest = await WithdrawRequest.create({
        userId: req.user._id,
        amount,
        bankDetails,
        status: 'pending'
    });

    // Create Transaction record
    const transaction = await Transaction.create({
        userId: req.user._id,
        amount: amount,
        type: 'withdrawal',
        status: 'pending',
    });

    wallet.transactions.push(transaction._id);
    await wallet.save();

    return res.status(201).json(
        new ApiResponse(201, withdrawRequest, "Withdrawal request created successfully")
    );
});
