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

    // Check if medicine exists and is available
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }
    if (medicine.status !== 'listed') {
        throw new ApiError(400, "Medicine is not available for purchase");
    }

    const cart = await getOrCreateCart(req.user._id);

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(item => item.medicineId.toString() === medicineId);

    if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.items.push({ medicineId, quantity });
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
        cart.items = [];
        await cart.save();
    }

    return res.status(200).json(
        new ApiResponse(200, [], "Cart cleared successfully")
    );
});
