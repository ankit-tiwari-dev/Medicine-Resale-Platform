import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true, // Send cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for responses to handle 401/refresh later
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Basic error log for now
        console.error("API Error:", error.response?.data?.message || error.message);

        // TODO: Handle token refresh logic here
        if (error.response?.status === 401) {
            // Redirect to login or refresh token
        }
        return Promise.reject(error);
    }
);

export default api;
