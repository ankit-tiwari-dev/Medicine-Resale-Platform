import express from "express";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import {
    verifyMedicine,
    getAdminMedicines,
    assignRider,
    getAvailableRiders,
    approveCollection,
    getAdminLogs,
    getAdminStats,
    getWithdrawalRequests,
    approveWithdrawal,
    rejectWithdrawal,
    getAllUsers,
    updateUser,
    deleteUser,
    getAllOrders,
    updateOrderStatus,
    getPendingKycRiders,
    verifyRiderKYC,
    getRiderKYCDetail
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require Admin role
router.use(verifyJWT, verifyAdmin);

// Medicine Management
router.patch("/medicine/verify/:id", verifyMedicine);
router.get("/medicines", getAdminMedicines);
router.post("/assign-rider", assignRider);
router.get("/available-riders", getAvailableRiders);
router.post("/approve-collection", approveCollection);

// Order Management
router.get("/orders", getAllOrders);
router.patch("/order/status/:id", updateOrderStatus);

// Withdrawal Management
router.get("/withdrawals", getWithdrawalRequests);
router.patch("/withdrawal/approve/:id", approveWithdrawal);
router.patch("/withdrawal/reject/:id", rejectWithdrawal);

// User Management
router.get("/users", getAllUsers);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

// KYC Management
router.get("/kyc/pending", getPendingKycRiders);
router.get("/kyc/rider/:id", getRiderKYCDetail);
router.patch("/kyc/verify/:id", verifyRiderKYC);

// Audit Logs
router.get("/logs", getAdminLogs);
router.get("/stats", getAdminStats);

export default router;
