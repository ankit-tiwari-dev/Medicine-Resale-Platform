import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Medicine } from "../models/medicine.model.js";
import { Order } from "../models/order.model.js";
import { Transaction } from "../models/transaction.model.js";

export const getDashboardActivity = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Fetch Recent Medicines (Listings)
    const recentMedicines = await Medicine.find({ sellerId: userId })
        .sort({ createdAt: -1 })
        .limit(5);

    // 2. Fetch Recent Orders (As a Seller)
    const recentOrders = await Order.find({ sellerId: userId })
        .sort({ createdAt: -1 })
        .limit(5);

    // 3. Fetch Recent Transactions
    const recentTransactions = await Transaction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5);

    // 4. Transform into unified activity objects
    const activities = [
        ...recentMedicines.map(m => ({
            id: m._id,
            type: 'listing',
            title: m.extractedData?.name || 'New Listing',
            description: `Listing initialized in '${m.status}' status.`,
            timestamp: m.createdAt,
            status: m.status
        })),
        ...recentOrders.map(o => ({
            id: o._id,
            type: 'order',
            title: `Order #${o._id.toString().slice(-6).toUpperCase()}`,
            description: `Received order for ${o.items?.length || 0} items.`,
            timestamp: o.createdAt,
            status: o.status
        })),
        ...recentTransactions.map(t => ({
            id: t._id,
            type: 'transaction',
            title: `${t.type.toUpperCase()}: ₹${t.amount}`,
            description: `Transaction ${t.status}.`,
            timestamp: t.createdAt,
            status: t.status
        }))
    ];

    // 5. Sort by timestamp descending and take top 8
    const sortedActivity = activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 8);

    return res.status(200).json(
        new ApiResponse(200, sortedActivity, "Dashboard activity fetched successfully")
    );
});
