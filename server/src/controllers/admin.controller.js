import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Medicine } from "../models/medicine.model.js";
import { Rider } from "../models/rider.model.js";
import { User } from "../models/user.model.js";
import { AdminLog } from "../models/admin_log.model.js";
import { Wallet } from "../models/wallet.model.js";
import { Transaction } from "../models/transaction.model.js";
import { WithdrawRequest } from "../models/withdraw_request.model.js";
import { Order } from "../models/order.model.js";
import { sendKycApprovalEmail, sendKycRejectionEmail } from "../utils/mailer.js";
import logger from "../utils/logger.js";

// ============ MEDICINE MANAGEMENT ============

export const verifyMedicine = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { action, reason } = req.body;

    const medicine = await Medicine.findById(id);
    if (!medicine) throw new ApiError(404, "Medicine not found");

    if (action === 'approve') {
        medicine.adminVerified = true;
        medicine.status = 'verified';
        medicine.rejectionReason = undefined;
    } else if (action === 'reject') {
        medicine.adminVerified = false;
        medicine.status = 'rejected';
        medicine.rejectionReason = reason || "No reason provided";
    } else {
        throw new ApiError(400, "Invalid action. Use 'approve' or 'reject'");
    }

    await medicine.save();

    await AdminLog.create({
        adminId: req.user._id,
        action: `MEDICINE_${action.toUpperCase()}`,
        targetId: medicine._id,
        targetType: 'Medicine',
        details: { reason }
    });

    return res.status(200).json(new ApiResponse(200, medicine, `Medicine ${action}d successfully`));
});

export const getAdminMedicines = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const medicines = await Medicine.find(filter)
        .populate("sellerId", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, medicines, "Medicines fetched successfully"));
});

export const assignRider = asyncHandler(async (req, res) => {
    const { medicineId, riderId } = req.body;

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) throw new ApiError(404, "Medicine not found");

    if (medicine.status !== 'verified') {
        throw new ApiError(400, "Medicine must be verified before assigning rider");
    }

    // riderId here is referring to the userId of the rider
    const rider = await Rider.findOne({ userId: riderId });
    if (!rider) throw new ApiError(404, "Rider not found");

    medicine.riderId = rider.userId;
    medicine.status = 'pickup_assigned';
    await medicine.save();

    rider.assignedTasks = rider.assignedTasks || [];
    rider.assignedTasks.push(medicine._id);
    await rider.save();

    await AdminLog.create({
        adminId: req.user._id,
        action: 'ASSIGN_RIDER',
        targetId: medicine._id,
        targetType: 'Medicine',
        details: { riderId }
    });

    return res.status(200).json(new ApiResponse(200, medicine, "Rider assigned successfully"));
});

export const getAvailableRiders = asyncHandler(async (req, res) => {
    const riders = await Rider.find({ isActive: true }).populate("userId", "name email phone");
    return res.status(200).json(new ApiResponse(200, riders, "Active riders fetched successfully"));
});

export const approveCollection = asyncHandler(async (req, res) => {
    const { medicineId } = req.body;

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) throw new ApiError(404, "Medicine not found");

    if (medicine.status !== 'collected') {
        throw new ApiError(400, "Medicine has not been collected by rider yet");
    }

    let wallet = await Wallet.findOne({ userId: medicine.sellerId });
    if (!wallet) {
        wallet = await Wallet.create({ userId: medicine.sellerId, balance: 0, transactions: [] });
    }

    const transaction = await Transaction.create({
        userId: medicine.sellerId,
        amount: medicine.price,
        type: 'credit',
        status: 'completed',
        medicineId: medicine._id
    });

    wallet.balance += medicine.price;
    wallet.transactions.push(transaction._id);
    await wallet.save();

    medicine.status = 'listed';
    await medicine.save();

    await AdminLog.create({
        adminId: req.user._id,
        action: 'APPROVE_COLLECTION',
        targetId: medicine._id,
        targetType: 'Medicine',
        details: { creditedAmount: medicine.price }
    });

    return res.status(200).json(new ApiResponse(200, { medicine, wallet }, "Collection approved and wallet credited"));
});

// ============ AUDIT & LOGS ============

export const getAdminLogs = asyncHandler(async (req, res) => {
    const logs = await AdminLog.find()
        .populate("adminId", "name email")
        .sort({ createdAt: -1 })
        .limit(20);

    return res.status(200).json(new ApiResponse(200, logs, "Admin logs fetched successfully"));
});

export const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalMedicines = await Medicine.countDocuments();

    const revenueData = await Transaction.aggregate([
        { $match: { type: 'credit', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    const verificationsPending = await Rider.countDocuments({ verificationStatus: "verified_pending_admin" });
    const sellersActive = await User.countDocuments({ role: "user" }); // Users are the 'entities'
    const ridersActive = await User.countDocuments({ role: "rider" });
    const totalOrders = await Order.countDocuments();
    const pendingWithdrawals = await WithdrawRequest.countDocuments({ status: "pending" });

    // Monthly revenue for current year
    const currentYear = new Date().getFullYear();
    const monthlyRevenueData = await Transaction.aggregate([
        {
            $match: {
                type: 'credit',
                status: 'completed',
                createdAt: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lte: new Date(`${currentYear}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$createdAt' },
                total: { $sum: '$amount' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Build full 12-month array (0 for months with no data)
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
        const found = monthlyRevenueData.find(d => d._id === i + 1);
        return found ? found.total : 0;
    });

    return res.status(200).json(new ApiResponse(200, {
        totalUsers,
        totalMedicines,
        totalRevenue,
        verificationsPending,
        sellersActive,
        ridersActive,
        totalOrders,
        pendingWithdrawals,
        monthlyRevenue
    }, "Admin stats fetched successfully"));
});

// ============ WITHDRAWAL MANAGEMENT ============

export const getWithdrawalRequests = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const withdrawals = await WithdrawRequest.find(filter)
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, withdrawals, "Withdrawal requests fetched successfully"));
});

export const approveWithdrawal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const withdrawal = await WithdrawRequest.findById(id);
    if (!withdrawal) throw new ApiError(404, "Withdrawal request not found");
    if (withdrawal.status !== 'pending') throw new ApiError(400, "Withdrawal request already processed");

    withdrawal.status = 'approved';
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user._id;
    await withdrawal.save();

    const transaction = await Transaction.findOne({
        userId: withdrawal.userId,
        amount: withdrawal.amount,
        type: 'withdrawal',
        status: 'pending'
    }).sort({ createdAt: 1 });

    if (transaction) {
        transaction.status = 'completed';
        await transaction.save();
    }

    await AdminLog.create({
        adminId: req.user._id,
        action: 'APPROVE_WITHDRAWAL',
        targetId: withdrawal._id,
        targetType: 'WithdrawRequest',
        details: { amount: withdrawal.amount }
    });

    return res.status(200).json(new ApiResponse(200, withdrawal, "Withdrawal approved successfully"));
});

export const rejectWithdrawal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const withdrawal = await WithdrawRequest.findById(id);
    if (!withdrawal) throw new ApiError(404, "Withdrawal request not found");
    if (withdrawal.status !== 'pending') throw new ApiError(400, "Withdrawal request already processed");

    withdrawal.status = 'rejected';
    withdrawal.rejectionReason = reason || "No reason provided";
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user._id;
    await withdrawal.save();

    const wallet = await Wallet.findOne({ userId: withdrawal.userId });
    if (wallet) {
        wallet.balance += withdrawal.amount;
        await wallet.save();
    }

    const transaction = await Transaction.findOne({
        userId: withdrawal.userId,
        amount: withdrawal.amount,
        type: 'withdrawal',
        status: 'pending'
    }).sort({ createdAt: 1 });

    if (transaction) {
        transaction.status = 'failed';
        await transaction.save();
    }

    await AdminLog.create({
        adminId: req.user._id,
        action: 'REJECT_WITHDRAWAL',
        targetId: withdrawal._id,
        targetType: 'WithdrawRequest',
        details: { amount: withdrawal.amount, reason }
    });

    return res.status(200).json(new ApiResponse(200, withdrawal, "Withdrawal rejected and amount refunded"));
});

// ============ USER MANAGEMENT ============

export const getAllUsers = asyncHandler(async (req, res) => {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
        .select("-password -otp -otpExpires -refreshToken")
        .sort({ createdAt: -1 }) // Use createdAt instead of _id for clarity, though both work
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

    const total = await User.countDocuments(filter);

    return res.status(200).json(new ApiResponse(200, {
        users,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    }, "Users fetched successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, isVerified } = req.body;

    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    if (role) user.role = role;
    if (typeof isVerified === 'boolean') user.isVerified = isVerified;

    await user.save();

    await AdminLog.create({
        adminId: req.user._id,
        action: 'UPDATE_USER',
        targetId: user._id,
        targetType: 'User',
        details: { role, isVerified }
    });

    return res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new ApiError(404, "User not found");

    await AdminLog.create({
        adminId: req.user._id,
        action: 'DELETE_USER',
        targetId: user._id,
        targetType: 'User',
        details: { email: user.email }
    });

    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

// ============ ORDER MANAGEMENT ============

export const getAllOrders = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
        .populate("buyerId", "name email")
        .populate("orderItems.medicineId")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const VALID_ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'disputed'];

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_ORDER_STATUSES.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}`);
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    order.status = status;
    if (status === 'delivered') order.deliveredAt = new Date();
    if (status === 'shipped') order.shippedAt = new Date();

    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
        status,
        at: new Date(),
        by: "admin"
    });
    await order.save();

    await AdminLog.create({
        adminId: req.user._id,
        action: 'UPDATE_ORDER_STATUS',
        targetId: order._id,
        targetType: 'Order',
        details: { status }
    });

    return res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
});

// ============ KYC MANAGEMENT ============

export const getRiderKYCDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rider = await Rider.findById(id).populate("userId", "name email phone");
    if (!rider) throw new ApiError(404, "Rider profile not found");

    return res.status(200).json(new ApiResponse(200, rider, "Rider KYC details fetched successfully"));
});

export const getPendingKycRiders = asyncHandler(async (req, res) => {
    const riders = await Rider.find({ verificationStatus: "verified_pending_admin" })
        .populate("userId", "name email phone");

    return res.status(200).json(new ApiResponse(200, riders, "Pending KYC riders fetched successfully"));
});

export const verifyRiderKYC = asyncHandler(async (req, res) => {
    const { id } = req.params; // rider id
    const { action, reason } = req.body;

    const rider = await Rider.findById(id).populate("userId", "name email");
    if (!rider) throw new ApiError(404, "Rider profile not found");

    if (rider.verificationStatus !== "verified_pending_admin" && rider.verificationStatus !== "document_mismatch") {
        throw new ApiError(400, "Rider is not in the pending verification queue");
    }

    if (action === 'approve') {
        rider.verificationStatus = 'verified';
        rider.isVerified = true;

        // Notify Rider - wrapped in try-catch to prevent 500 if mail service fails
        try {
            await sendKycApprovalEmail(rider.userId.email, rider.userId.name);
        } catch (emailError) {
            logger.error(`Failed to send KYC approval email to ${rider.userId.email}: ${emailError.message}`);
        }
    } else if (action === 'reject') {
        rider.verificationStatus = 'rejected';
        rider.isVerified = false;

        // Notify Rider - wrapped in try-catch to prevent 500 if mail service fails
        try {
            await sendKycRejectionEmail(rider.userId.email, rider.userId.name, reason);
        } catch (emailError) {
            logger.error(`Failed to send KYC rejection email to ${rider.userId.email}: ${emailError.message}`);
        }
    } else {
        throw new ApiError(400, "Invalid action. Use 'approve' or 'reject'");
    }

    await rider.save();

    await AdminLog.create({
        adminId: req.user._id,
        action: `KYC_${action.toUpperCase()}`,
        targetId: rider._id,
        targetType: 'Rider',
        details: { reason }
    });

    return res.status(200).json(new ApiResponse(200, rider, `Rider KYC ${action}d successfully`));
});