import axiosInstance from "./axiosInstance";

export const raiseDispute = (payload) => {
  const formData = new FormData();
  formData.append("orderId", payload.orderId);
  formData.append("reason", payload.reason);
  formData.append("description", payload.description || "");
  (payload.evidence || []).forEach((file) => formData.append("evidence", file));
  return axiosInstance.post("/disputes/raise", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const getDisputes = () => axiosInstance.get("/disputes");
export const resolveDispute = (disputeId, payload) => axiosInstance.post(`/disputes/${disputeId}/resolve`, payload);
