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
        stock: {
            type: Number,
            default: 1,
            required: true
        },
        adminVerified: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['uploaded', 'verified', 'rejected', 'pickup_assigned', 'collected', 'listed', 'sold'],
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
        pickupCoordinates: {
            lat: Number,
            lng: Number
        },
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
        },
        reservedUntil: {
            type: Date
        },
        reservedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

// Text index for fuzzy search
medicineSchema.index({ "extractedData.name": "text", "description": "text" });

export const Medicine = mongoose.model('Medicine', medicineSchema);
