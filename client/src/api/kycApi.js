import axiosInstance from "./axiosInstance";

export const uploadKycDocuments = (documents) => {
  const formData = new FormData();
  Object.entries(documents).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  return axiosInstance.post("/kyc/upload-docs", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const verifyAadhar = (payload) => axiosInstance.post("/kyc/verify-aadhar", payload);
export const verifyKycDoc = (payload) => axiosInstance.post("/kyc/verify-doc", payload);
export const verifyPayout = (payload = {}) => axiosInstance.post("/kyc/verify-payout", payload);
export const submitKycConsent = (payload) => axiosInstance.post("/kyc/submit-consent", payload);
