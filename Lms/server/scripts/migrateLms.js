import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../configs/mongodb.js";
import User from "../models/User.js";
import Course from "../models/course.js";
import Purchase from "../models/purchase.js";
import Enrollment from "../models/Enrollment.js";
import Review from "../models/Review.js";

const run = async () => {
  await connectDB();
  const users = await User.find({ enrolledCourses: { $exists: true, $ne: [] } }).lean();
  for (const user of users) {
    for (const courseId of user.enrolledCourses || []) {
      const purchase = await Purchase.findOne({ userId: user._id, courseId, status: "completed" }).sort({ createdAt: -1 });
      await Enrollment.updateOne({ userId: user._id, courseId }, { $setOnInsert: { userId: user._id, courseId, purchaseId: purchase?._id || null, status: "active" } }, { upsert: true });
    }
  }
  const courses = await Course.find({ courseRating: { $exists: true, $ne: [] } });
  for (const course of courses) {
    for (const item of course.courseRating || []) {
      if (item?.userId && item?.rating) await Review.updateOne({ userId: item.userId, courseId: course._id }, { $set: { rating: item.rating, isApproved: true } }, { upsert: true });
    }
    const stats = await Review.aggregate([{ $match: { courseId: course._id, isApproved: true } }, { $group: { _id: null, averageRating: { $avg: "$rating" }, ratingCount: { $sum: 1 } } }]);
    if (stats[0]) {
      course.averageRating = Number(stats[0].averageRating.toFixed(2));
      course.ratingCount = stats[0].ratingCount;
      await course.save();
    }
  }
  console.log("LMS migration completed.");
  await mongoose.disconnect();
};
run().catch(async (error) => { console.error("LMS migration failed:", error); await mongoose.disconnect(); process.exit(1); });
