import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  certificateNumber: { type: String, required: true, unique: true, index: true },
  userId: { type: String, ref: "User", required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  issuedAt: { type: Date, default: Date.now },
  pdfUrl: { type: String, default: "" },
  verificationUrl: { type: String, default: "" },
}, { timestamps: true });

certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);
