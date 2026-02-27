import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        otp: {
            type: String,
            required: true
        },
        otpExpires: {
            type: Date,
            required: true
        },
        userData: {
            name: String,
            password: { type: String, required: true },
            phone: String,
            role: { type: String, default: "user" }
        }
    },
    {
        timestamps: true
    }
);

// TTL index to automatically remove expired OTPs after 15 minutes (or however long we want to keep the record around after expiration)
// Setting expireAfterSeconds to 0 means documents expire at `otpExpires`
otpSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model("Otp", otpSchema);
