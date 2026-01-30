import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getWalletBalance, getTransactions, requestWithdrawal } from "../controllers/wallet.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/balance", getWalletBalance);
router.get("/transactions", getTransactions);
router.post("/withdraw", requestWithdrawal);

export default router;
