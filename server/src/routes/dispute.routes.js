import express from "express";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { createDispute, getDisputes, resolveDispute } from "../controllers/dispute.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/raise", upload.fields([{ name: "evidence", maxCount: 5 }]), createDispute);
router.get("/", getDisputes);

// Admin only resolve
router.post("/:disputeId/resolve", verifyRole("admin"), resolveDispute);

export default router;
