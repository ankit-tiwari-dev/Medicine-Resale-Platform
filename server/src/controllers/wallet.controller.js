import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wallet } from "../models/wallet.model.js";
import { WithdrawRequest } from "../models/withdraw_request.model.js";
import { Transaction } from "../models/transaction.model.js";

// Helper to get or create wallet
const getOrCreateWallet = async (userId) => {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        wallet = await Wallet.create({ userId });
    }
    return wallet;
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
    const { amount, bankDetails } = req.body;

    if (amount <= 0) {
        throw new ApiError(400, "Amount must be greater than zero");
    }

    const wallet = await getOrCreateWallet(req.user._id);

    if (wallet.balance < amount) {
        throw new ApiError(400, "Insufficient balance");
    }

    //create withdraw request
    const withdrawRequest = await WithdrawRequest.create({
        userId: req.user._id,
        amount,
        bankDetails,
        status: 'pending'
    });

    // We do NOT deduct balance immediately or maybe we do?
    // Usually we deduct to "locked" state. Or we just deduct and if rejected refund.
    // Let's deduct immediately for simplicity to avoid double spend.

    wallet.balance -= amount;

    // Create Transaction record
    const transaction = await Transaction.create({
        userId: req.user._id,
        amount: amount,
        type: 'withdrawal',
        status: 'pending',
        // medicineId is null
    });

    wallet.transactions.push(transaction._id);
    await wallet.save();

    return res.status(201).json(
        new ApiResponse(201, withdrawRequest, "Withdrawal request created successfully")
    );
});
