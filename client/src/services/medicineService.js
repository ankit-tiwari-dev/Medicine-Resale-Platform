import axiosInstance from "../api/axiosInstance";

const medicineService = {
    getAll: async (params = {}) => {
        const response = await axiosInstance.get("/medicines", { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/medicines/${id}`);
        return response.data;
    },

    upload: async (formData) => {
        const response = await axiosInstance.post("/medicines/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    getUserMedicines: async () => {
        const response = await axiosInstance.get("/medicines/my-listings");
        return response.data;
    }
};

export default medicineService;
