import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  userId: { type: String, ref: "User", required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "INR", uppercase: true },
  status: { type: String, enum: ["pending", "completed", "failed", "refunded", "cancelled"], default: "pending", index: true },
  paymentMethod: { type: String, enum: ["stripe", "manual", "free"], default: "stripe" },
  paymentId: { type: String, default: "", index: true },
  stripeSessionId: { type: String, default: "", index: true },
  stripePaymentIntentId: { type: String, default: "", index: true },
  couponCode: { type: String, default: "" },
  discountAmount: { type: Number, default: 0, min: 0 },
  refundedAt: { type: Date, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true, minimize: false });

purchaseSchema.index({ userId: 1, courseId: 1, status: 1 });
purchaseSchema.index({ stripeSessionId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
