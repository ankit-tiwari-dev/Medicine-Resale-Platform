import axiosInstance from "./axiosInstance";

export const getWalletBalance = () => axiosInstance.get("/wallet/balance");
export const getWalletTransactions = () => axiosInstance.get("/wallet/transactions");
export const requestWithdrawal = (payload) => axiosInstance.post("/wallet/withdraw", payload);
