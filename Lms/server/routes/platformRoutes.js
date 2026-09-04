import express from "express";
import { protectUser } from "../middlewares/authMiddleware.js";
import {
  enrollFreeCourse,
  upsertReview,
  getCourseReviews,
  toggleWishlist,
  getWishlist,
  updateLectureProgress,
  getNotifications,
  markNotificationRead,
  verifyCertificate,
} from "../controllers/platformController.js";

const router = express.Router();
router.post("/enroll", protectUser, enrollFreeCourse);
router.post("/review", protectUser, upsertReview);
router.get("/course/:courseId/reviews", getCourseReviews);
router.post("/wishlist/toggle", protectUser, toggleWishlist);
router.get("/wishlist", protectUser, getWishlist);
router.post("/lecture-progress", protectUser, updateLectureProgress);
router.get("/notifications", protectUser, getNotifications);
router.patch("/notifications/:id/read", protectUser, markNotificationRead);
router.get("/certificate/:certificateNumber", verifyCertificate);

export default router;
