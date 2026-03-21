import axiosInstance from "./axiosInstance";

export const getDashboardActivity = () => axiosInstance.get("/dashboard/activity");
