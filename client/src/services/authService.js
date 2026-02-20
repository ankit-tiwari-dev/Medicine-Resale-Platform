import axiosInstance from "../api/axiosInstance";

const authService = {
    login: async (email, password) => {
        const response = await axiosInstance.post("/auth/login", { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
    },

    verifyOtp: async (email, otp) => {
        const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
        return response.data;
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    },

    getCurrentUser: async () => {
        const response = await axiosInstance.get("/auth/me");
        return response.data;
    }
};

export default authService;
