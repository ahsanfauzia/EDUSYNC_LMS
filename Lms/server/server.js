import dotenv from "dotenv";
dotenv.config();

console.log("CLERK PUBLISHABLE:", !!process.env.CLERK_PUBLISHABLE_KEY);
console.log("CLERK SECRET:", !!process.env.CLERK_SECRET_KEY);

import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/mongodb.js";
import connectCloudinary from "./configs/cloudinary.js";

import {
  clerkWebhooks,
  stripeWebhooks,
} from "./controllers/webhooks.js";

import educatorRouter from "./routes/educatorRouter.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";
import platformRouter from "./routes/platformRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();

// =====================================================
// WEBHOOKS MUST RECEIVE RAW BODY
// =====================================================

app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// =====================================================
// BASIC MIDDLEWARE
// =====================================================

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

// Small in-memory guard for obvious API abuse. Use a shared store/rate limiter at scale.
const requestCounts = new Map();
app.use("/api", (req, res, next) => {
  const key = `${req.ip}:${Math.floor(Date.now() / 60000)}`;
  const count = (requestCounts.get(key) || 0) + 1;
  requestCounts.set(key, count);
  if (requestCounts.size > 10000) requestCounts.clear();
  if (count > 180) return res.status(429).json({ success: false, message: "Too many requests. Try again shortly." });
  next();
});

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/educator", educatorRouter);

app.use("/api/course", courseRouter);

app.use("/api/user", userRouter);
app.use("/api/platform", platformRouter);
app.use("/api/admin", adminRouter);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  console.log(
    `404 Route Not Found: ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// SERVER START
// =====================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await connectCloudinary();

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Server failed:", error);

    process.exit(1);
  }
};

startServer();