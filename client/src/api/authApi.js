import axiosInstance from "./axiosInstance";

export const registerUser = (payload) => axiosInstance.post("/auth/register", payload);
export const loginUser = (payload) => axiosInstance.post("/auth/login", payload);
export const verifyOtp = (payload) => axiosInstance.post("/auth/verify-otp", payload);
export const resendOtp = (payload) => axiosInstance.post("/auth/resend-otp", payload);
export const refreshToken = (payload = {}) => axiosInstance.post("/auth/refresh-token", payload);
export const logoutUser = () => axiosInstance.post("/auth/logout");
export const getCurrentUser = () => axiosInstance.get("/auth/me");
export const updateProfile = (payload) => axiosInstance.patch("/auth/profile", payload);
export const uploadAvatar = (formData) => axiosInstance.post("/auth/profile-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" }
});

export const getGoogleOAuthUrl = () => `${axiosInstance.defaults.baseURL}/auth/google`;
