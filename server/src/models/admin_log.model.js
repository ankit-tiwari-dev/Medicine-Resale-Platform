import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        action: {
            type: String,
            required: true
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'targetType'
        },
        targetType: {
            type: String,
            enum: ['User', 'Medicine', 'Order', 'WithdrawRequest', 'Rider'],
            required: true
        },
        details: {
            type: Object
        },
        ipAddress: String
    },
    {
        timestamps: true
    }
);

export const AdminLog = mongoose.model("AdminLog", adminLogSchema);
