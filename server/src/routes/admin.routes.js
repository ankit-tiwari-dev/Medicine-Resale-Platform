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
    updateOrderStatus
} from "../controllers/admin.controller.js";

const router = express.Router();

// All routes require Admin role
router.use(verifyJWT, verifyRole("admin"));

// Medicine verification
router.get("/medicines", getAdminMedicines);
router.post("/medicines/:id/verify", verifyMedicine);

// Rider management
router.get("/riders", getAvailableRiders);
router.post("/assign-rider", assignRider);

// Collection approval
router.post("/approve-collection", approveCollection);

// Withdrawal management
router.get("/withdrawals", getWithdrawalRequests);
router.post("/withdrawals/:id/approve", approveWithdrawal);
router.post("/withdrawals/:id/reject", rejectWithdrawal);

// User management
router.get("/users", getAllUsers);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Order management
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

// Activity logs
router.get("/logs", getAdminLogs);

// System stats
router.get("/stats", getAdminStats);

export default router;
