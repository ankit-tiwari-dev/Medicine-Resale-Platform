import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getDashboardActivity } from "../controllers/dashboard.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/activity", getDashboardActivity);

export default router;
