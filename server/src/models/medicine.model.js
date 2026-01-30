import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        images: {
            type: [String],
            required: true
        },
        extractedData: {
            name: String,
            expiryDate: Date,
            batchNumber: String,
            mrp: Number
        },
        adminVerified: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['uploaded', 'verified', 'pickup_assigned', 'collected', 'listed', 'sold'],
            default: 'uploaded'
        },
        isExpired: {
            type: Boolean,
            default: false
        },
        rejectionReason: String,
        riderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        price: Number,
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        pickupLocation: String,
        description: {
            type: String,
            trim: true
        },
        pickupProof: {
            type: String // URL to cloud storage (S3/Cloudinary)
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

export const Medicine = mongoose.model('Medicine', medicineSchema);