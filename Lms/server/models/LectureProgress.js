import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  lectureId: { type: String, required: true },
  watchedSeconds: { type: Number, default: 0, min: 0 },
  durationSeconds: { type: Number, default: 0, min: 0 },
  completed: { type: Boolean, default: false },
  lastWatchedAt: { type: Date, default: Date.now },
}, { timestamps: true });

lectureProgressSchema.index({ userId: 1, courseId: 1, lectureId: 1 }, { unique: true });

export default mongoose.models.LectureProgress || mongoose.model("LectureProgress", lectureProgressSchema);
