import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Create Axios Instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies (refresh token)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                // Assuming /auth/refresh-token uses HttpOnly cookie for the refresh token
                // and returns { accessToken: 'new_token' }
                const { data } = await api.post('/auth/refresh-token');

                const newAccessToken = data.accessToken || data.token; // Handle both cases

                if (newAccessToken) {
                    localStorage.setItem('token', newAccessToken);

                    // Update header for the retry
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // Retry original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - Logout user
                console.error('Token refresh failed', refreshError);
                localStorage.removeItem('token');
                window.location.href = '/login'; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

/* -- API ENDPOINTS -- */

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);
export const verifyOtp = (email, otp) => api.post('/auth/verify-otp', { email, otp });

// Medicines
export const uploadMedicine = (formData) => {
    return api.post('/medicines/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getMedicines = (params = {}) => {
    // params example: { search: 'aspirin', sort: 'price_asc', page: 1 }
    return api.get('/medicines', { params });
};

// Cart
export const addToCart = (medicineId, quantity = 1) => api.post('/cart/add', { medicineId, quantity });
export const getCart = () => api.get('/cart');

// Admin
export const verifyMedicine = (medicineId, status, reason = '') => {
    return api.patch(`/admin/medicines/${medicineId}/verify`, { status, reason });
};

export default api;
