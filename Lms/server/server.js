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

app.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

app.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// =====================================================
// BASIC MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

// =====================================================
// SIMPLE API RATE LIMIT GUARD
// =====================================================

const requestCounts = new Map();

app.use("/api", (req, res, next) => {
  const key = `${req.ip}:${Math.floor(Date.now() / 60000)}`;

  const count = (requestCounts.get(key) || 0) + 1;

  requestCounts.set(key, count);

  if (requestCounts.size > 10000) {
    requestCounts.clear();
  }

  if (count > 180) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Try again shortly.",
    });
  }

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
// DATABASE / CLOUDINARY INITIALIZATION
// =====================================================

let initialized = false;

const initializeServer = async () => {
  if (initialized) {
    return;
  }

  await connectDB();

  await connectCloudinary();

  initialized = true;

  console.log("Server services initialized successfully");
};

// =====================================================
// LOCAL DEVELOPMENT
// =====================================================

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  initializeServer()
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `🚀 Server running on http://localhost:${PORT}`
        );
      });
    })
    .catch((error) => {
      console.error("❌ Server failed:", error);
      process.exit(1);
    });
}

// =====================================================
// VERCEL SERVERLESS HANDLER
// =====================================================

const handler = async (req, res) => {
  try {
    await initializeServer();

    return app(req, res);
  } catch (error) {
    console.error(
      "❌ Server initialization failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server initialization failed",
    });
  }
};

export default handler;