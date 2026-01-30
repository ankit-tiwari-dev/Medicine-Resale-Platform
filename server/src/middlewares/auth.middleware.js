import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken?.id).select("-password -otp -otpExpires -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

export const verifyRole = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        // If the route requires 'user' role, 'rider' can also access it (Dual-Capability)
        const authorizedRoles = roles.includes('user') ? [...roles, 'rider'] : roles;

        if (!authorizedRoles.includes(userRole)) {
            throw new ApiError(403, "You are not authorized to perform this action");
        }
        next();
    };
};