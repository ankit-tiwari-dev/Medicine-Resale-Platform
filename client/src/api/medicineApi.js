import axiosInstance from "./axiosInstance";

export const browseMedicines = (params = {}) => axiosInstance.get("/medicines", { params });
export const getMedicineDetails = (medicineId) => axiosInstance.get(`/medicines/${medicineId}`);
export const uploadMedicine = (formData) =>
  axiosInstance.post("/medicines/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
export const getMyMedicines = () => axiosInstance.get("/medicines/my-medicines");
export const updateMedicine = (medicineId, payload) => axiosInstance.patch(`/medicines/${medicineId}`, payload);
