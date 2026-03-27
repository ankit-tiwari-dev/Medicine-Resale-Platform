import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';
import logger from "./utils/logger.js";
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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN
]
  .flatMap((value) => (value ? value.split(",") : []))
  .map((value) => value.trim())
  .filter(Boolean);

logger.info(
  `Configured CORS origins: ${allowedOrigins.length ? allowedOrigins.join(", ") : "none"}`
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    logger.warn(`Blocked by CORS: ${origin}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

// Apply Security Guardrails
app.use(securityHeaders);
app.use(requestId);

// Custom Request Logger using Winston
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms [ID: ${req.id || '-'}]`);
  });
  next();
});

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
import dashboardRouter from "./routes/dashboard.routes.js";

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
app.use("/api/v1/dashboard", dashboardRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  const errors = err.errors || [];
  const data = err.data || null;

  if (process.env.NODE_ENV === 'test') {
    logger.error("ERROR HANDLER STACK:", err.stack);
  } else {
    logger.error(`ERROR HANDLER - Status: ${statusCode} Message: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    data
  });
});

app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));

export default app;
