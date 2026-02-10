import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        currentLocation: {
            lat: Number,
            lng: Number
        },
        assignedTasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine"
        }],
        completedTasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine"
        }],
        earnings: {
            type: Number,
            default: 0
        },
        aadharNumber: {
            type: String,
            unique: true,
            sparse: true
        },
        panNumber: {
            type: String,
            unique: true,
            sparse: true
        },
        licenseNumber: {
            type: String,
            unique: true,
            sparse: true
        },
        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected", "verified_pending_admin", "document_mismatch"],
            default: "pending"
        },
        documents: {
            aadharFront: String,
            aadharBack: String,
            panFront: String,
            panBack: String,
            licenseFront: String,
            licenseBack: String,
            selfie: String
        },
        extractedData: {
            aadhar: {
                fullName: String,
                dob: String,
                gender: String,
                pincode: String,
                state: String,
                district: String,
                vtc: String,
                maskedAadhar: String,
                profileImage: String,
                isCrossVerified: {
                    type: Boolean,
                    default: false
                },
                verifiedAt: Date
            },
            pan: {
                panNumber: String,
                fullName: String,
                verifiedAt: Date
            },
            license: {
                licenseNumber: String,
                fullName: String,
                dob: String,
                verifiedAt: Date
            }
        },
        consent: {
            isGiven: {
                type: Boolean,
                default: false
            },
            timestamp: Date,
            ipAddress: String
        },
        vehicleDetails: {
            type: String,
            model: String
        }
    },
    {
        timestamps: true
    }
);

export const Rider = mongoose.model("Rider", riderSchema);
