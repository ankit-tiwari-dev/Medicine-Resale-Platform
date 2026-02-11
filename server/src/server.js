import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import {
  securityHeaders,
  sanitizeData,
  xssClean,
  requestId,
  globalLimiter,
  authLimiter,
  kycLimiter
} from "./middlewares/security.middleware.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Apply Security Guardrails
app.use(securityHeaders);
app.use(requestId);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms [ID: :req[x-request-id]]'));

app.use(express.json({ limit: "16kb" })); // Production limit
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(sanitizeData);
app.use(xssClean);

app.use(globalLimiter);

import authRouter from './routes/auth.routes.js';
import medicineRouter from './routes/medicine.routes.js';
import adminRouter from './routes/admin.routes.js';
import walletRouter from './routes/wallet.routes.js';
import riderRouter from "./routes/rider.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import cartRouter from "./routes/cart.routes.js";
import kycRouter from "./routes/kyc.routes.js";
import disputeRouter from "./routes/dispute.routes.js";
import reviewRouter from "./routes/review.routes.js";

app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/medicines', medicineRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/wallet', walletRouter);
app.use("/api/v1/rider", riderRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/kyc", kycLimiter, kycRouter);
app.use("/api/v1/disputes", disputeRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  const errors = err.errors || [];
  const data = err.data || null;

  if (process.env.NODE_ENV === 'test') {
    console.error("ERROR HANDLER STACK:", err.stack);
  } else {
    console.error("ERROR HANDLER - Status:", statusCode, "Message:", message);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    data
  });
});

app.get('/health', (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));

export default app;