import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, trim: true, maxlength: 2000, default: "" },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

reviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });
reviewSchema.index({ courseId: 1, isApproved: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
