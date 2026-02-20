import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendOtp,
  verifyOtp,
  updateProfile as apiUpdateProfile,
  uploadAvatar as apiUploadAvatar
} from "../api/authApi";
import { extractErrorMessage, isRateLimited } from "../utils/errors";
import { storage } from "../utils/storage";

export const AuthContext = createContext(null);

const resolveAuthTokens = (payload) => {
  return {
    accessToken: payload?.data?.accessToken || payload?.data?.token || payload?.accessToken || payload?.token || null,
    refreshToken: payload?.data?.refreshToken || payload?.refreshToken || null,
    user: payload?.data?.user || payload?.user || null
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSession, setOtpSession] = useState(null);
  const [rateLimit, setRateLimit] = useState({ active: false, retryAfter: null, message: "" });

  const updateRateLimitState = (error) => {
    if (!isRateLimited(error)) {
      setRateLimit({ active: false, retryAfter: null, message: "" });
      return;
    }
    const retryAfter = error?.rateLimitInfo?.retryAfter || null;
    setRateLimit({
      active: true,
      retryAfter,
      message: retryAfter
        ? `Too many attempts. Retry after ${retryAfter} seconds.`
        : "Too many attempts. Please retry later."
    });
  };

  const saveAuthState = (payload) => {
    const { accessToken, refreshToken, user: nextUser } = resolveAuthTokens(payload);

    if (accessToken) storage.setAccessToken(accessToken);
    if (refreshToken) storage.setRefreshToken(refreshToken);
    if (nextUser) {
      storage.setUser(nextUser);
      setUser(nextUser);
    }
  };

  const bootstrapAuth = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      const nextUser = response?.data?.data || response?.data?.user || null;
      if (nextUser) {
        storage.setUser(nextUser);
        setUser(nextUser);
      }
    } catch {
      storage.clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const login = async (payload) => {
    setIsSubmitting(true);
    try {
      const response = await loginUser(payload);
      const statusCode = response?.data?.statusCode;

      if (statusCode === 202) {
        setOtpSession({
          email: payload.email,
          userId: response?.data?.data?.userId || response?.data?.userId || null
        });
        return { success: true, otpRequired: true, message: "OTP verification required." };
      }

      saveAuthState(response?.data);
      setOtpSession(null);
      setRateLimit({ active: false, retryAfter: null, message: "" });
      const loggedInUser = response?.data?.data?.user || response?.data?.user;
      return { success: true, otpRequired: false, user: loggedInUser };
    } catch (error) {
      updateRateLimitState(error);
      return { success: false, message: extractErrorMessage(error, "Unable to login") };
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (payload) => {
    setIsSubmitting(true);
    try {
      const response = await registerUser(payload);
      const userId = response?.data?.data?.userId || response?.data?.userId || null;
      setOtpSession({ email: payload.email, userId });
      setRateLimit({ active: false, retryAfter: null, message: "" });
      return { success: true, otpRequired: true };
    } catch (error) {
      updateRateLimitState(error);
      return { success: false, message: extractErrorMessage(error, "Unable to register") };
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitOtp = async (payload) => {
    setIsSubmitting(true);
    try {
      const response = await verifyOtp(payload);
      saveAuthState(response?.data);
      setOtpSession(null);
      const loggedInUser = response?.data?.data?.user || response?.data?.user;
      return { success: true, user: loggedInUser };
    } catch (error) {
      updateRateLimitState(error);
      return { success: false, message: extractErrorMessage(error, "OTP verification failed") };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendVerificationOtp = async (payload) => {
    setIsSubmitting(true);
    try {
      await resendOtp(payload);
      return { success: true };
    } catch (error) {
      updateRateLimitState(error);
      return { success: false, message: extractErrorMessage(error, "Unable to resend OTP") };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProfile = async (payload) => {
    setIsSubmitting(true);
    try {
      const response = await apiUpdateProfile(payload);
      const nextUser = response?.data?.data || response?.data?.user || null;
      if (nextUser) {
        storage.setUser(nextUser);
        setUser(nextUser);
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error, "Unable to update profile") };
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadUserAvatar = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await apiUploadAvatar(formData);
      const avatarUrl = response?.data?.data?.avatar || response?.data?.avatar;

      if (avatarUrl && user) {
        const nextUser = { ...user, avatar: avatarUrl };
        storage.setUser(nextUser);
        setUser(nextUser);
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error, "Photo upload failed") };
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Logout should complete locally even if API call fails.
    } finally {
      storage.clearAuth();
      setUser(null);
      setOtpSession(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isSubmitting,
      otpSession,
      rateLimit,
      isAuthenticated: Boolean(user),
      login,
      register,
      submitOtp,
      resendVerificationOtp,
      logout,
      updateProfile,
      uploadUserAvatar,
      refreshUser: bootstrapAuth,
      setOtpSession
    }),
    [user, loading, isSubmitting, otpSession, rateLimit]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
