import axiosInstance from "./axiosInstance";

export const getAdminMedicines = (params = {}) => axiosInstance.get("/admin/medicines", { params });
export const verifyAdminMedicine = (medicineId, payload) => axiosInstance.patch(`/admin/medicine/verify/${medicineId}`, payload);
export const assignRiderToMedicine = (payload) => axiosInstance.post("/admin/assign-rider", payload);
export const getAvailableRiders = () => axiosInstance.get("/admin/available-riders");
export const approveCollection = (payload) => axiosInstance.post("/admin/approve-collection", payload);

export const getAdminOrders = (params = {}) => axiosInstance.get("/admin/orders", { params });
export const updateAdminOrderStatus = (orderId, payload) => axiosInstance.patch(`/admin/order/status/${orderId}`, payload);

export const getAdminWithdrawals = (params = {}) => axiosInstance.get("/admin/withdrawals", { params });
export const approveWithdrawal = (withdrawalId) => axiosInstance.patch(`/admin/withdrawal/approve/${withdrawalId}`);
export const rejectWithdrawal = (withdrawalId, payload) => axiosInstance.patch(`/admin/withdrawal/reject/${withdrawalId}`, payload);

export const getAdminUsers = (params = {}) => axiosInstance.get("/admin/users", { params });
export const updateAdminUser = (userId, payload) => axiosInstance.patch(`/admin/user/${userId}`, payload);
export const deleteAdminUser = (userId) => axiosInstance.delete(`/admin/user/${userId}`);

export const getPendingKycRiders = () => axiosInstance.get("/admin/kyc/pending");
export const getRiderKycDetail = (riderId) => axiosInstance.get(`/admin/kyc/rider/${riderId}`);
export const verifyRiderKyc = (riderId, payload) => axiosInstance.patch(`/admin/kyc/verify/${riderId}`, payload);

export const getAdminLogs = () => axiosInstance.get("/admin/logs");
export const getAdminStats = () => axiosInstance.get("/admin/stats");
