import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import { User } from '../models/user.model.js';
import { oauth2Client } from '../config/google.js';
import { sendOTP, sendWelcome } from '../utils/mailer.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateJWT.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const refreshCookieOptions = {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000
};

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

export const verifyOTP = asyncHandler(async (req, res) => {
    const { email, userId, otp, userOtp } = req.body;

    const identifier = userId || email;
    const providedOtp = otp || userOtp;

    if (!identifier) {
        throw new ApiError(400, "Email or User ID is required");
    }

    if (!providedOtp) {
        throw new ApiError(400, "OTP is required");
    }

    // Find user by ID or Email
    const user = await User.findOne({
        $or: [
            { _id: mongoose.Types.ObjectId.isValid(identifier) ? identifier : null },
            { email: identifier }
        ].filter(q => q._id !== null || q.email)
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.otpExpires < Date.now()) {
        throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    const isMatch = await bcrypt.compare(providedOtp, user.otp);

    if (!isMatch) {
        throw new ApiError(400, "Invalid verification code");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    await sendWelcome(user.email, user.name);

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(new ApiResponse(200, {
            user: { id: user._id, name: user.name, email: user.email },
            accessToken
        }, "Email verified successfully!"));
});

export const loginLocal = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.password) {
        throw new ApiError(400, "This account was created with Google. Please use Google Login.");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email first", { userId: user._id });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(new ApiResponse(200, {
            user: { id: user._id, name: user.name, email: user.email },
            accessToken
        }, "Login successful"));
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", refreshCookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken?.id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export const googleAuthCallback = asyncHandler(async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data: profile } = await oauth2.userinfo.get();

        let user = await User.findOne({ email: profile.email });

        if (!user) {
            user = await User.create({
                email: profile.email,
                name: profile.name,
                isVerified: true,
                googleId: profile.id
            });
            await sendWelcome(user.email, user.name);
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
    }
});

export const registerLocal = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const randomOTP = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcrypt.hash(randomOTP, 10);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword,
        name,
        isVerified: false,
        otp: hashedOTP,
        otpExpires: Date.now() + 600000
    });

    // Try to send OTP email, but don't fail registration if it fails
    try {
        await sendOTP(email, randomOTP);
    } catch (emailError) {
        console.error('Failed to send OTP email:', emailError.message);
    }

    res.status(201).json(new ApiResponse(201, { userId: user._id }, "Registration successful. Please verify your email."));
});
