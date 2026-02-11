import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
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
    medicineId: {
        type: Schema.Types.ObjectId,
        ref: "Medicine",
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxLength: 500
    }
}, { timestamps: true });

// Prevent multiple reviews for the same medicine in the same order by the same buyer
reviewSchema.index({ buyerId: 1, orderId: 1, medicineId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
