import mongoose from "mongoose";
import Course from "../models/course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import Review from "../models/Review.js";
import Wishlist from "../models/Wishlist.js";
import LectureProgress from "../models/LectureProgress.js";
import Notification from "../models/Notification.js";
import Certificate from "../models/Certificate.js";

const validObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const enrollFreeCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;
    if (!validObjectId(courseId)) return res.status(400).json({ success: false, message: "Invalid course ID" });

    const course = await Course.findOne({ _id: courseId, isPublished: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const finalPrice = Math.max(0, course.coursePrice - (course.coursePrice * course.discount) / 100);
    if (finalPrice > 0) return res.status(400).json({ success: false, message: "This course requires payment" });

    let enrollment = await Enrollment.findOne({ userId, courseId });
    const isNewEnrollment = !enrollment;
    if (!enrollment) enrollment = await Enrollment.create({ userId, courseId, status: "active" });
    else if (enrollment.status !== "active" && enrollment.status !== "completed") { enrollment.status = "active"; await enrollment.save(); }

    await Promise.all([
      User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } }),
      Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId }, ...(isNewEnrollment ? { $inc: { enrollmentCount: 1 } } : {}) }),
      Notification.create({ userId, title: "Course enrolled", message: `You are enrolled in ${course.courseTitle}.`, type: "course" }),
    ]);

    return res.status(200).json({ success: true, enrollment });
  } catch (error) {
    if (error?.code === 11000) return res.status(200).json({ success: true, message: "Already enrolled" });
    console.error("enrollFreeCourse Error:", error);
    return res.status(500).json({ success: false, message: "Unable to enroll" });
  }
};

export const upsertReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId, rating, review = "" } = req.body;
    if (!validObjectId(courseId) || !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: "Valid course ID and rating from 1 to 5 are required" });
    }
    const enrolled = await Enrollment.exists({ userId, courseId, status: { $in: ["active", "completed"] } });
    if (!enrolled) return res.status(403).json({ success: false, message: "You must be enrolled to review this course" });

    const saved = await Review.findOneAndUpdate(
      { userId, courseId },
      { $set: { rating: Number(rating), review: String(review).trim() } },
      { new: true, upsert: true, runValidators: true }
    );

    const stats = await Review.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId), isApproved: true } },
      { $group: { _id: null, averageRating: { $avg: "$rating" }, ratingCount: { $sum: 1 } } },
    ]);
    const s = stats[0] || { averageRating: 0, ratingCount: 0 };
    await Course.findByIdAndUpdate(courseId, { averageRating: Number(s.averageRating.toFixed(2)), ratingCount: s.ratingCount });

    return res.json({ success: true, review: saved, averageRating: s.averageRating, ratingCount: s.ratingCount });
  } catch (error) {
    console.error("upsertReview Error:", error);
    return res.status(500).json({ success: false, message: "Unable to save review" });
  }
};

export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!validObjectId(courseId)) return res.status(400).json({ success: false, message: "Invalid course ID" });
    const reviews = await Review.find({ courseId, isApproved: true }).sort({ createdAt: -1 }).limit(100).lean();
    const ids = reviews.map(r => r.userId);
    const users = await User.find({ _id: { $in: ids } }).select("_id name imageUrl").lean();
    const map = new Map(users.map(u => [u._id, u]));
    return res.json({ success: true, reviews: reviews.map(r => ({ ...r, user: map.get(r.userId) || null })) });
  } catch (error) {
    console.error("getCourseReviews Error:", error);
    return res.status(500).json({ success: false, message: "Unable to load reviews" });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;
    if (!validObjectId(courseId)) return res.status(400).json({ success: false, message: "Invalid course ID" });
    const existing = await Wishlist.findOne({ userId, courseId });
    if (existing) {
      await existing.deleteOne();
      await User.findByIdAndUpdate(userId, { $pull: { wishlist: courseId } });
      return res.json({ success: true, wishlisted: false });
    }
    await Wishlist.create({ userId, courseId });
    await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: courseId } });
    return res.json({ success: true, wishlisted: true });
  } catch (error) {
    console.error("toggleWishlist Error:", error);
    return res.status(500).json({ success: false, message: "Unable to update wishlist" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.userId }).populate({ path: "courseId", select: "courseTitle courseThumbnail coursePrice discount averageRating isPublished" }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, wishlist: items });
  } catch (error) {
    console.error("getWishlist Error:", error);
    return res.status(500).json({ success: false, message: "Unable to load wishlist" });
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId, watchedSeconds = 0, durationSeconds = 0, completed = false } = req.body;
    if (!validObjectId(courseId) || !lectureId) return res.status(400).json({ success: false, message: "Course ID and lecture ID are required" });
    const enrolled = await Enrollment.exists({ userId: req.userId, courseId, status: { $in: ["active", "completed"] } });
    if (!enrolled) return res.status(403).json({ success: false, message: "Enrollment required" });

    const progress = await LectureProgress.findOneAndUpdate(
      { userId: req.userId, courseId, lectureId },
      { $set: { watchedSeconds: Math.max(0, Number(watchedSeconds) || 0), durationSeconds: Math.max(0, Number(durationSeconds) || 0), completed: Boolean(completed), lastWatchedAt: new Date() } },
      { new: true, upsert: true, runValidators: true }
    );
    return res.json({ success: true, progress });
  } catch (error) {
    console.error("updateLectureProgress Error:", error);
    return res.status(500).json({ success: false, message: "Unable to save lecture progress" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(50).lean();
    return res.json({ success: true, notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to load notifications" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { isRead: true });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to update notification" });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateNumber: req.params.certificateNumber }).populate("courseId", "courseTitle").lean();
    if (!certificate) return res.status(404).json({ success: false, message: "Certificate not found" });
    const user = await User.findById(certificate.userId).select("name imageUrl").lean();
    return res.json({ success: true, certificate: { ...certificate, user } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to verify certificate" });
  }
};
