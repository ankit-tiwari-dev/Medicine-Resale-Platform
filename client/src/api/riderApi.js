import axiosInstance from "./axiosInstance";

export const getRiderTasks = (params = {}) => axiosInstance.get("/rider/tasks", { params });
export const getRiderStats = () => axiosInstance.get("/rider/stats");

export const confirmCollection = ({ medicineId, proof }) => {
  const formData = new FormData();
  formData.append("medicineId", medicineId);
  if (proof) formData.append("proof", proof);
  return axiosInstance.post("/rider/confirm-collection", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};
