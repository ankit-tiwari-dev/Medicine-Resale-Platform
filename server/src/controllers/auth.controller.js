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
import { uploadToCloudinary } from '../utils/cloudinary.helper.js';

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

        // Hash the refresh token before storing in DB
        const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        user.refreshToken = hashedRefreshToken;
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
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
        );

        const user = await User.findById(decodedToken?.id);

        if (!user || !user.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const hashedIncomingToken = crypto.createHash('sha256').update(incomingRefreshToken).digest('hex');
        if (hashedIncomingToken !== user?.refreshToken) {
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

export const googleAuth = asyncHandler(async (req, res) => {
    const state = crypto.randomBytes(32).toString('hex');
    res.cookie('oauth_state', state, { ...cookieOptions, maxAge: 3600000 }); // 1 hour

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        prompt: 'consent',
        state
    });
    res.redirect(url);
});

export const googleAuthCallback = asyncHandler(async (req, res) => {
    try {
        const { code, state } = req.query;
        const savedState = req.cookies.oauth_state;

        if (!state || state !== savedState) {
            throw new ApiError(400, "Invalid OAuth state. Potential CSRF detected.");
        }

        res.clearCookie('oauth_state');

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
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
    }
});

export const registerLocal = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        throw new ApiError(400, "Email, password, and name are required");
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

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

export const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "This account is already verified. Please login.");
    }

    const randomOTP = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcrypt.hash(randomOTP, 10);

    user.otp = hashedOTP;
    user.otpExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    try {
        await sendOTP(email, randomOTP);
    } catch (emailError) {
        console.error('Failed to resend OTP email:', emailError.message);
        throw new ApiError(500, "Failed to send verification email. Please try again later.");
    }

    res.status(200).json(new ApiResponse(200, {}, "A new verification code has been sent to your email."));
});
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Nested address update fix
    if (address) {
        if (address.street) user.address.street = address.street;
        if (address.city) user.address.city = address.city;
        if (address.pincode) user.address.pincode = address.pincode;
        // Specifically avoid touching coordinates unless provided
        if (address.coordinates) {
            user.address.coordinates = {
                ...user.address.coordinates,
                ...address.coordinates
            };
        }
    }

    await user.save();

    res.status(200).json(
        new ApiResponse(
            200,
            user, // Returns the full updated user including avatar
            "Profile updated successfully"
        )
    );
});

export const updateAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Avatar image is required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const avatarUrl = await uploadToCloudinary(
        req.file.buffer,
        "avatars",
        `avatar_${user._id}_${Date.now()}`
    );

    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, { avatar: avatarUrl }, "Avatar updated successfully")
    );
});
