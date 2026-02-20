import axiosInstance from "../api/axiosInstance";

const orderService = {
    create: async (orderData) => {
        const response = await axiosInstance.post("/orders", orderData);
        return response.data;
    },

    getMyOrders: async () => {
        const response = await axiosInstance.get("/orders/my-orders");
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/orders/${id}`);
        return response.data;
    }
};

export default orderService;
