import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Purchase", default: null },
  status: { type: String, enum: ["active", "completed", "cancelled", "expired"], default: "active", index: true },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);
