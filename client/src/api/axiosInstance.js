import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { storage } from "../utils/storage";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

let isRefreshing = false;
let queuedRequests = [];

const resolveQueue = (error, token = null) => {
  queuedRequests.forEach((promise) => {
    if (error) {
      promise.reject(error);
      return;
    }
    promise.resolve(token);
  });
  queuedRequests = [];
};

const getAccessTokenFromResponse = (responseData) => {
  return (
    responseData?.data?.accessToken ||
    responseData?.data?.token ||
    responseData?.accessToken ||
    responseData?.token ||
    null
  );
};

const getRefreshTokenFromResponse = (responseData) => {
  return (
    responseData?.data?.refreshToken ||
    responseData?.refreshToken ||
    null
  );
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    const requestId = response?.headers?.["x-request-id"];
    if (import.meta.env.DEV && requestId) {
      console.info(`[API] ${response.config?.method?.toUpperCase()} ${response.config?.url} request-id=${requestId}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};
    const statusCode = error?.response?.status;

    if (statusCode === 429) {
      const retryAfter = error?.response?.headers?.["retry-after"];
      error.rateLimitInfo = {
        retryAfter: retryAfter ? Number(retryAfter) : null
      };
      return Promise.reject(error);
    }

    const refreshToken = storage.getRefreshToken();
    const isAuthPath = originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/verify-otp") ||
      originalRequest.url?.includes("/auth/resend-otp") ||
      originalRequest.url?.includes("/auth/refresh-token");

    if (statusCode !== 401 || originalRequest._retry || isAuthPath) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queuedRequests.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/auth/refresh-token`,
        refreshToken ? { refreshToken } : {},
        { withCredentials: true }
      );

      const nextAccessToken = getAccessTokenFromResponse(refreshResponse.data);
      const nextRefreshToken = getRefreshTokenFromResponse(refreshResponse.data);

      if (!nextAccessToken) {
        throw new Error("Token refresh failed");
      }

      storage.setAccessToken(nextAccessToken);
      if (nextRefreshToken) {
        storage.setRefreshToken(nextRefreshToken);
      }

      axiosInstance.defaults.headers.common.Authorization = `Bearer ${nextAccessToken}`;
      resolveQueue(null, nextAccessToken);

      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      resolveQueue(refreshError, null);
      storage.clearAuth();
      if (!originalRequest.url?.includes("/auth/me")) {
        window.location.replace("/login");
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
