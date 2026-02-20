import axiosInstance from "./axiosInstance";

export const createOrder = (payload) => axiosInstance.post("/orders", payload);
export const getMyOrders = () => axiosInstance.get("/orders/my-orders");
export const getOrderDetails = (orderId) => axiosInstance.get(`/orders/${orderId}`);
export const getOrderTracking = (orderId) => axiosInstance.get(`/orders/${orderId}/tracking`);
export const confirmOrderDelivery = (orderId) => axiosInstance.post(`/orders/${orderId}/confirm-delivery`);
