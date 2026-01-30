import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';

dotenv.config({
  path: './.env'
});

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import authRouter from './routes/auth.routes.js';
import medicineRouter from './routes/medicine.routes.js';
import adminRouter from './routes/admin.routes.js';
import walletRouter from './routes/wallet.routes.js';
import riderRouter from "./routes/rider.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import cartRouter from "./routes/cart.routes.js";

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/medicines', medicineRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/wallet', walletRouter);
app.use("/api/v1/rider", riderRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/cart", cartRouter);

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    console.error("ERROR HANDLER STACK:", err.stack);
  } else {
    console.error("ERROR HANDLER:", err.message);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  const errors = err.errors || [];
  const data = err.data || null;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    data
  });
});

const PORT = process.env.PORT || 5000;

export default app;