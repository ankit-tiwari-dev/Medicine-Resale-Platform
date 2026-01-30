import express from "express";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { getMyTasks, confirmCollection, getRiderStats } from "../controllers/rider.controller.js";

const router = express.Router();

router.use(verifyJWT, verifyRole("rider"));

router.get("/tasks", getMyTasks);
router.get("/stats", getRiderStats);
router.post("/confirm-collection", upload.single("proof"), confirmCollection);

export default router;
