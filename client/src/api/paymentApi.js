import axiosInstance from "./axiosInstance";

export const createPaymentOrder = (payload) => axiosInstance.post("/payment/create-order", payload);
export const verifyPayment = (payload) => axiosInstance.post("/payment/verify", payload);
