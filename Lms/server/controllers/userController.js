import mongoose from "mongoose";
import Stripe from "stripe";
import User from "../models/User.js";
import Course from "../models/course.js";
import Purchase from "../models/purchase.js";
import CourseProgress from "../models/CourseProgress.js";
import Enrollment from "../models/Enrollment.js";
import Review from "../models/Review.js";
import Notification from "../models/Notification.js";
import Certificate from "../models/Certificate.js";
import crypto from "crypto";
import { clerkClient } from "@clerk/express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ensureUser = async (userId) => {
  let user = await User.findById(userId);
  if (user) return user;
  const clerkUser = await clerkClient.users.getUser(userId);
  return User.create({
    _id: clerkUser.id,
    name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
    email: clerkUser.emailAddresses?.[0]?.emailAddress || `${clerkUser.id}@placeholder.local`,
    imageUrl: clerkUser.imageUrl || "",
    role: clerkUser.publicMetadata?.role || "student",
    emailVerified: Boolean(clerkUser.emailAddresses?.[0]?.verification?.status === "verified"),
  });
};

export const getUserData = async (req, res) => {
  try {
    const user = await ensureUser(req.userId);
    await User.findByIdAndUpdate(req.userId, { lastLoginAt: new Date() });
    return res.json({ success: true, user });
  } catch (error) {
    console.error("getUserData Error:", error);
    return res.status(500).json({ success: false, message: "Unable to load user" });
  }
};

export const userEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.userId, status: { $in: ["active", "completed"] } })
      .populate("courseId")
      .sort({ enrolledAt: -1 })
      .lean();
    return res.json({ success: true, enrolledCourses: enrollments.map(e => e.courseId).filter(Boolean), enrollments });
  } catch (error) {
    console.error("userEnrolledCourses Error:", error);
    return res.status(500).json({ success: false, message: "Unable to load enrolled courses" });
  }
};

export const purchaseCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId, couponCode = "" } = req.body;
    if (!courseId) return res.status(400).json({ success: false, message: "Course ID is required" });

    const course = await Course.findOne({ _id: courseId, isPublished: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const alreadyEnrolled = await Enrollment.exists({ userId, courseId, status: { $in: ["active", "completed"] } });
    if (alreadyEnrolled) return res.status(400).json({ success: false, message: "You are already enrolled in this course" });

    const basePrice = Math.max(0, course.coursePrice - (course.coursePrice * course.discount) / 100);
    const user = await ensureUser(userId);

    if (basePrice === 0) {
      const purchase = await Purchase.create({ courseId, userId, amount: 0, currency: "INR", status: "completed", paymentMethod: "free" });
      await Enrollment.create({ userId, courseId, purchaseId: purchase._id, status: "active" });
      await Promise.all([
        User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } }),
        Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId }, $inc: { enrollmentCount: 1 } }),
        Notification.create({ userId, title: "Course enrolled", message: `You are enrolled in ${course.courseTitle}.`, type: "course" }),
      ]);
      return res.json({ success: true, free: true, purchase });
    }

    const purchase = await Purchase.create({ courseId, userId, amount: basePrice, currency: "INR", status: "pending", paymentMethod: "stripe", couponCode: String(couponCode).trim().toUpperCase() });
    const frontendUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: [{ price_data: { currency: "inr", product_data: { name: course.courseTitle, description: course.courseDescription.slice(0, 500), images: course.courseThumbnail ? [course.courseThumbnail] : undefined }, unit_amount: Math.round(basePrice * 100) }, quantity: 1 }],
      metadata: { purchaseId: String(purchase._id), userId, courseId: String(courseId) },
      success_url: `${frontendUrl}/player/${courseId}?payment=success`,
      cancel_url: `${frontendUrl}/course/${courseId}?payment=cancelled`,
    });
    purchase.stripeSessionId = session.id;
    await purchase.save();
    return res.json({ success: true, checkoutUrl: session.url, purchaseId: purchase._id });
  } catch (error) {
    console.error("purchaseCourse Error:", error);
    return res.status(500).json({ success: false, message: "Unable to start payment" });
  }
};

export const updateUserCourseProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    if (!courseId || !lectureId) return res.status(400).json({ success: false, message: "Course ID and Lecture ID are required" });
    const enrolled = await Enrollment.exists({ userId: req.userId, courseId, status: { $in: ["active", "completed"] } });
    if (!enrolled) return res.status(403).json({ success: false, message: "Enrollment required" });

    const course = await Course.findById(courseId).select("courseContent certificateEnabled");
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    const validLecture = course.courseContent.some(c => c.chapterContent?.some(l => l.lectureId === lectureId));
    if (!validLecture) return res.status(400).json({ success: false, message: "Lecture does not belong to this course" });

    let progress = await CourseProgress.findOneAndUpdate(
      { userId: req.userId, courseId },
      { $setOnInsert: { userId: req.userId, courseId }, $set: { currentLectureId: lectureId, lastAccessedAt: new Date() }, $addToSet: { lectureCompleted: lectureId } },
      { new: true, upsert: true }
    );
    const totalLectures = course.courseContent.reduce((n, c) => n + (c.chapterContent?.length || 0), 0);
    const completedCount = progress.lectureCompleted.length;
    const completed = totalLectures > 0 && completedCount >= totalLectures;
    progress.percentage = totalLectures ? Math.min(100, Math.round((completedCount / totalLectures) * 100)) : 0;
    progress.completed = completed;
    if (completed && !progress.completedAt) progress.completedAt = new Date();
    await progress.save();
    if (completed) {
      await Enrollment.findOneAndUpdate({ userId: req.userId, courseId }, { status: "completed", completedAt: progress.completedAt });
      if (course.certificateEnabled) {
        const existing = await Certificate.findOne({ userId: req.userId, courseId });
        if (!existing) {
          const certificateNumber = `LMS-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
          await Certificate.create({ certificateNumber, userId: req.userId, courseId, issuedAt: new Date(), verificationUrl: `/verify-certificate/${certificateNumber}` });
          await Notification.create({ userId: req.userId, title: "Certificate issued", message: "Congratulations. Your course certificate is ready to verify.", type: "certificate", link: `/verify-certificate/${certificateNumber}` });
        }
      }
    }
    return res.json({ success: true, progress });
  } catch (error) {
    console.error("updateUserCourseProgress Error:", error);
    return res.status(500).json({ success: false, message: "Unable to update progress" });
  }
};

export const getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ success: false, message: "Course ID is required" });
    const progress = await CourseProgress.findOne({ userId: req.userId, courseId }).lean();
    return res.json({ success: true, progress: progress || { userId: req.userId, courseId, completed: false, percentage: 0, lectureCompleted: [] } });
  } catch (error) {
    console.error("getUserCourseProgress Error:", error);
    return res.status(500).json({ success: false, message: "Unable to load progress" });
  }
};

export const addUserRatings = async (req, res) => {
  try {
    const { courseId, rating } = req.body;
    if (!courseId || !rating || Number(rating) < 1 || Number(rating) > 5) return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    const enrolled = await Enrollment.exists({ userId: req.userId, courseId, status: { $in: ["active", "completed"] } });
    if (!enrolled) return res.status(403).json({ success: false, message: "You must be enrolled in this course to rate it" });
    await Review.findOneAndUpdate({ userId: req.userId, courseId }, { rating: Number(rating) }, { upsert: true, new: true, runValidators: true });
    const stats = await Review.aggregate([{ $match: { courseId: new mongoose.Types.ObjectId(courseId), isApproved: true } }, { $group: { _id: null, averageRating: { $avg: "$rating" }, ratingCount: { $sum: 1 } } }]);
    const s = stats[0] || { averageRating: 0, ratingCount: 0 };
    await Course.findByIdAndUpdate(courseId, { averageRating: Number(s.averageRating.toFixed(2)), ratingCount: s.ratingCount });
    return res.json({ success: true, message: "Rating saved", averageRating: s.averageRating, ratingCount: s.ratingCount });
  } catch (error) {
    console.error("addUserRatings Error:", error);
    return res.status(500).json({ success: false, message: "Unable to save rating" });
  }
};
