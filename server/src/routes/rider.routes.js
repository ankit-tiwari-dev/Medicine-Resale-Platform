import express from "express";
import { verifyJWT, verifyRole, verifyRiderVerified } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
    getMyTasks,
    confirmCollection,
    getRiderStats,
    updateDutyStatus
} from "../controllers/rider.controller.js";

const router = express.Router();

router.use(verifyJWT, verifyRole("rider"), verifyRiderVerified);

router.get("/tasks", getMyTasks);
router.get("/stats", getRiderStats);
router.patch("/duty-status", updateDutyStatus);
router.post("/confirm-collection", upload.single("proof"), confirmCollection);

export default router;