import axiosInstance from "./axiosInstance";

export const getHealthStatus = () => axiosInstance.get("/health");
