import axiosInstance from "./axiosInstance";

export const addReview = (payload) => axiosInstance.post("/reviews/add", payload);
export const getSellerReviews = (sellerId) => axiosInstance.get(`/reviews/seller/${sellerId}`);
export const getMedicineReviews = (medicineId) => axiosInstance.get(`/reviews/medicine/${medicineId}`);
