import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const protectUser = async (req, res, next) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    req.userId = userId;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

export const protectEducator = async (req, res, next) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Please login first" });

    const clerkUser = await clerkClient.users.getUser(userId);
    const role = clerkUser?.publicMetadata?.role;
    if (role !== "educator" && role !== "admin") {
      return res.status(403).json({ success: false, message: "Educator access required" });
    }

    req.userId = userId;
    req.educatorId = userId;
    next();
  } catch (error) {
    console.error("Educator Authentication Error:", error.message);
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

export const protectAdmin = async (req, res, next) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Please login first" });

    const clerkUser = await clerkClient.users.getUser(userId);
    const clerkRole = clerkUser?.publicMetadata?.role;
    const dbUser = await User.findById(userId).select("role status").lean();
    if (dbUser?.status === "suspended") return res.status(403).json({ success: false, message: "Account suspended" });
    if (clerkRole !== "admin" && dbUser?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error("Admin Authentication Error:", error.message);
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};
