import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String
    },
    phone: {
      type: String,
      unique: true,
      sparse: true 
    },
    password: {
      type: String
    },
    walletBalance: {
      type: Number,
      default: 0
    },
    googleId: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String
    },
    otpExpires: {
      type: Date
    },
    refreshToken: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "admin", "rider"],
      default: "user"
    },
    address: {
      street: String,
      city: String,
      pincode: String,
      coordinates: { lat: Number, lng: Number }
    },
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);