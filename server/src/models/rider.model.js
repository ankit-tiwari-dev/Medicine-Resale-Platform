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
            ref: "Medicine" // Currently riders are assigned Medicines for collection
        }],
        completedTasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine"
        }],
        earnings: {
            type: Number,
            default: 0
        },
        licenseNumber: String,
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
