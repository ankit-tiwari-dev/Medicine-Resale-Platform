import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AppLayout from "../layouts/AppLayout";
import AuthSplitLayout from "../layouts/AuthSplitLayout";
import PublicLayout from "../layouts/PublicLayout";
import RiderLayout from "../layouts/RiderLayout";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../utils/constants";

import LandingPage from "../pages/public/LandingPage";
import BrowseMedicinesPage from "../pages/public/BrowseMedicinesPage";
import MedicineDetailsPage from "../pages/public/MedicineDetailsPage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import RiderRegisterPage from "../pages/public/RiderRegisterPage";
import OtpVerificationPage from "../pages/public/OtpVerificationPage";
import OAuthCallbackPage from "../pages/public/OAuthCallbackPage";
import NotFoundPage from "../pages/public/NotFoundPage";
import DisputesPage from "../pages/public/DisputesPage";
import RaiseDisputePage from "../pages/public/RaiseDisputePage";
import SellerReviewsPage from "../pages/public/SellerReviewsPage";
import MedicineReviewsPage from "../pages/public/MedicineReviewsPage";

import DashboardHomePage from "../pages/user/DashboardHomePage";
import MyMedicinesPage from "../pages/user/MyMedicinesPage";
import UploadMedicinePage from "../pages/user/UploadMedicinePage";
import WalletPage from "../pages/user/WalletPage";
import OrdersPage from "../pages/user/OrdersPage";
import OrderDetailsPage from "../pages/user/OrderDetailsPage";
import CartPage from "../pages/user/CartPage";
import ProfilePage from "../pages/user/ProfilePage";

import BuyerCartPage from "../pages/buyer/BuyerCartPage";
import CheckoutPage from "../pages/buyer/CheckoutPage";
import OrderTrackingPage from "../pages/buyer/OrderTrackingPage";
import ConfirmDeliveryPage from "../pages/buyer/ConfirmDeliveryPage";

import RiderDashboardPage from "../pages/rider/RiderDashboardPage";
import RiderTasksPage from "../pages/rider/RiderTasksPage";
import RiderConfirmCollectionPage from "../pages/rider/RiderConfirmCollectionPage";
import RiderStatsPage from "../pages/rider/RiderStatsPage";
import RiderKycUploadPage from "../pages/rider/RiderKycUploadPage";
import RiderKycVerificationPage from "../pages/rider/RiderKycVerificationPage";
import RiderKycConsentPage from "../pages/rider/RiderKycConsentPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminMedicinesReviewPage from "../pages/admin/AdminMedicinesReviewPage";
import AdminRidersKycPage from "../pages/admin/AdminRidersKycPage";
import AdminAssignRiderPage from "../pages/admin/AdminAssignRiderPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminWithdrawalsPage from "../pages/admin/AdminWithdrawalsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminLogsPage from "../pages/admin/AdminLogsPage";
import AdminStatsPage from "../pages/admin/AdminStatsPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<BrowseMedicinesPage />} />
          <Route path="/browse/:id" element={<MedicineDetailsPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="/disputes" element={<ProtectedRoute><DisputesPage /></ProtectedRoute>} />
          <Route path="/disputes/raise" element={<ProtectedRoute><RaiseDisputePage /></ProtectedRoute>} />
          <Route path="/reviews/seller/:sellerId" element={<SellerReviewsPage />} />
          <Route path="/reviews/medicine/:medicineId" element={<MedicineReviewsPage />} />
        </Route>

        <Route element={<AuthSplitLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-rider" element={<RiderRegisterPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={[ROLES.BUYER, ROLES.SELLER]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="my-medicines" element={<MyMedicinesPage />} />
          <Route path="upload-medicine" element={<UploadMedicinePage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/buyer"
          element={
            <ProtectedRoute roles={[ROLES.BUYER, ROLES.SELLER]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="cart" element={<BuyerCartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders/:id/tracking" element={<OrderTrackingPage />} />
          <Route path="orders/:id/confirm-delivery" element={<ConfirmDeliveryPage />} />
        </Route>

        <Route
          path="/rider"
          element={
            <ProtectedRoute roles={[ROLES.RIDER]}>
              <RiderLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RiderDashboardPage />} />
          <Route path="tasks" element={<RiderTasksPage />} />
          <Route path="confirm-collection" element={<RiderConfirmCollectionPage />} />
          <Route path="stats" element={<RiderStatsPage />} />
          <Route path="kyc/upload-docs" element={<RiderKycUploadPage />} />
          <Route path="kyc/verify-docs" element={<RiderKycVerificationPage />} />
          <Route path="kyc/consent" element={<RiderKycConsentPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="medicines-review" element={<AdminMedicinesReviewPage />} />
          <Route path="riders-kyc" element={<AdminRidersKycPage />} />
          <Route path="assign-rider" element={<AdminAssignRiderPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="logs" element={<AdminLogsPage />} />
          <Route path="stats" element={<AdminStatsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/sell" element={<Navigate to="/register" replace />} />
        <Route path="/cart" element={<Navigate to="/dashboard/cart" replace />} />
        <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
