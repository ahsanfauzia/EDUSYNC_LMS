import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completed: { type: Boolean, default: false },
  percentage: { type: Number, default: 0, min: 0, max: 100 },
  currentLectureId: { type: String, default: "" },
  lectureCompleted: [{ type: String }],
  totalWatchedSeconds: { type: Number, default: 0, min: 0 },
  lastAccessedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
}, { timestamps: true, minimize: false });

courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.CourseProgress || mongoose.model("CourseProgress", courseProgressSchema);
