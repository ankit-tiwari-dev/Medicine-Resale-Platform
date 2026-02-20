import axiosInstance from "./axiosInstance";

export const getCart = () => axiosInstance.get("/cart");
export const addToCart = (payload) => axiosInstance.post("/cart/add", payload);
export const removeFromCart = (medicineId) => axiosInstance.delete(`/cart/remove/${medicineId}`);
export const clearCart = () => axiosInstance.delete("/cart/clear");
