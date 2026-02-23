import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Medicine } from "../models/medicine.model.js";

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = await Cart.create({ userId, items: [] });
    }
    return cart;
};

export const addToCart = asyncHandler(async (req, res) => {
    const { medicineId, quantity = 1 } = req.body;
    const qtyToAdd = Number(quantity);

    if (isNaN(qtyToAdd) || qtyToAdd < 1) {
        throw new ApiError(400, "Invalid quantity");
    }

    // Check if medicine exists and is available
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }
    if (medicine.status !== 'listed') {
        throw new ApiError(400, "Medicine is not available for purchase");
    }

    if (medicine.sellerId.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot purchase your own medicine");
    }

    // Check if medicine is reserved by someone else
    if (medicine.reservedBy &&
        medicine.reservedBy.toString() !== req.user._id.toString() &&
        medicine.reservedUntil > new Date()) {
        throw new ApiError(400, "This medicine is currently reserved in someone else's cart");
    }

    // Set/Update reservation (15 minutes of TTL)
    medicine.reservedBy = req.user._id;
    medicine.reservedUntil = new Date(Date.now() + 15 * 60 * 1000);
    await medicine.save();

    const cart = await getOrCreateCart(req.user._id);

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(item => item.medicineId.toString() === medicineId.toString());

    if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity = Number(cart.items[itemIndex].quantity) + qtyToAdd;
    } else {
        // Add new item
        cart.items.push({ medicineId, quantity: qtyToAdd });
    }

    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Item added to cart successfully")
    );
});

export const removeFromCart = asyncHandler(async (req, res) => {
    const { medicineId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter(item => item.medicineId.toString() !== medicineId);
    await cart.save();

    // Clear reservation on remove
    const medicine = await Medicine.findById(medicineId);
    if (medicine && medicine.reservedBy?.toString() === req.user._id.toString()) {
        medicine.reservedBy = undefined;
        medicine.reservedUntil = undefined;
        await medicine.save();
    }

    return res.status(200).json(
        new ApiResponse(200, cart, "Item removed from cart successfully")
    );
});

export const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.medicineId");

    // Calculate totals? Optional but helpful
    let cartData = { items: [], totalAmount: 0 };

    if (cart) {
        cartData.items = cart.items;
        cartData._id = cart._id;
        // Filter out items where populate failed (if medicine deleted)
        const validItems = cart.items.filter(item => item.medicineId);

        cartData.totalAmount = validItems.reduce((acc, item) => {
            return acc + (item.medicineId.price * item.quantity);
        }, 0);
    }

    return res.status(200).json(
        new ApiResponse(200, cartData, "Cart fetched successfully")
    );
});

export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
        // Release reservations for all items in the cart
        for (const item of cart.items) {
            await Medicine.findByIdAndUpdate(item.medicineId, {
                $unset: { reservedBy: 1, reservedUntil: 1 }
            });
        }
        cart.items = [];
        await cart.save();
    }

    return res.status(200).json(
        new ApiResponse(200, [], "Cart cleared successfully")
    );
});

export const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { medicineId, quantity } = req.body;
    const newQty = Number(quantity);

    if (isNaN(newQty) || newQty < 1) {
        throw new ApiError(400, "Quantity must be a valid number and at least 1");
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(item => item.medicineId.toString() === medicineId.toString());
    if (itemIndex === -1) {
        throw new ApiError(404, "Item not found in cart");
    }

    cart.items[itemIndex].quantity = newQty;
    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Cart quantity updated successfully")
    );
});
