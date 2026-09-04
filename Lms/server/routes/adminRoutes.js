import express from "express";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import { getAdminDashboard, createCategory, createCoupon, updateUserStatus, approveReview } from "../controllers/adminController.js";

const router = express.Router();
router.use(protectAdmin);
router.get("/dashboard", getAdminDashboard);
router.post("/categories", createCategory);
router.post("/coupons", createCoupon);
router.patch("/users/:userId/status", updateUserStatus);
router.patch("/reviews/:reviewId", approveReview);
export default router;
