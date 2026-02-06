import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Medicine } from "../models/medicine.model.js";
import { Order } from "../models/order.model.js";

// Helper to group items by seller
const groupItemsBySeller = (items) => {
    const groups = {};
    items.forEach(item => {
        const sellerId = item.sellerId.toString();
        if (!groups[sellerId]) {
            groups[sellerId] = [];
        }
        groups[sellerId].push(item);
    });
    return groups;
};

const buildStatusHistoryEntry = (status, by = "system") => ({
    status,
    at: new Date(),
    by
});

export const createOrder = asyncHandler(async (req, res) => {
    // Accepts medicineId (single buy) OR items (array of IDs)
    // If buy from cart, frontend can send items array
    const { medicineId, items, shippingAddress } = req.body;

    let medicineIds = [];
    if (medicineId) medicineIds.push(medicineId);
    if (items && Array.isArray(items)) medicineIds = [...medicineIds, ...items];

    if (medicineIds.length === 0) {
        throw new ApiError(400, "No medicines selected for purchase");
    }

    // specific validation: unique ids only
    medicineIds = [...new Set(medicineIds)];

    // Fetch all medicines
    const medicines = await Medicine.find({ _id: { $in: medicineIds } });

    if (medicines.length !== medicineIds.length) {
        throw new ApiError(404, "Some medicines not found");
    }

    // Check availability
    const unavailable = medicines.filter(m => m.status !== 'listed');
    if (unavailable.length > 0) {
        throw new ApiError(400, `Some medicines are not available: ${unavailable.map(m => m.name).join(", ")}`);
    }

    const selfPurchase = medicines.filter(m => m.sellerId.toString() === req.user._id.toString());
    if (selfPurchase.length > 0) {
        throw new ApiError(400, `You cannot purchase your own medicine: ${selfPurchase.map(m => m.name).join(", ")}`);
    }

    // Group by seller
    const sellerGroups = groupItemsBySeller(medicines);

    const createdOrders = [];

    // Create one order per seller
    for (const sellerId in sellerGroups) {
        const sellerMedicines = sellerGroups[sellerId];
        const totalAmount = sellerMedicines.reduce((sum, m) => sum + m.price, 0);

        const orderItems = sellerMedicines.map(m => ({
            medicineId: m._id,
            price: m.price
        }));

        const order = await Order.create({
            buyerId: req.user._id,
            sellerId,
            orderItems,
            amount: totalAmount,
            shippingAddress,
            status: 'pending',
            statusHistory: [buildStatusHistoryEntry('pending', 'system')]
        });

        createdOrders.push(order);

        // Mark medicines as sold/reserved
        // In a real app we might wait for payment, but here we reserve them.
        for (const m of sellerMedicines) {
            m.status = 'sold'; // or 'reserved'
            m.buyerId = req.user._id;
            await m.save();
        }
    }

    return res.status(201).json(
        new ApiResponse(201, createdOrders, "Order(s) placed successfully")
    );
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ buyerId: req.user._id })
        .populate("orderItems.medicineId")
        .populate("sellerId", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, orders, "Orders fetched successfully")
    );
});

export const getOrderDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id)
        .populate("orderItems.medicineId")
        .populate("sellerId", "name email")
        .populate("buyerId", "name email");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Only buyer or seller or admin can see details
    if (order.buyerId._id.toString() !== req.user._id.toString() &&
        order.sellerId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
        throw new ApiError(403, "Unauthorized access to order details");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order details fetched successfully")
    );
});

export const getOrderTracking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id)
        .select("status statusHistory deliveredAt shippedAt createdAt updatedAt buyerId sellerId")
        .populate("sellerId", "name email")
        .populate("buyerId", "name email");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.buyerId._id.toString() !== req.user._id.toString() &&
        order.sellerId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
        throw new ApiError(403, "Unauthorized access to order tracking");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order tracking fetched successfully")
    );
});

export const confirmDelivery = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.buyerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the buyer can confirm delivery");
    }

    if (order.status === 'delivered') {
        throw new ApiError(400, "Order is already delivered");
    }

    if (order.status === 'cancelled') {
        throw new ApiError(400, "Cancelled orders cannot be delivered");
    }

    order.status = 'delivered';
    order.deliveredAt = new Date();
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push(buildStatusHistoryEntry('delivered', 'buyer'));

    await order.save();

    return res.status(200).json(
        new ApiResponse(200, order, "Order marked as delivered")
    );
});
