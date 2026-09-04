import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true, uppercase: true, index: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  maxUses: { type: Number, default: null, min: 1 },
  usedCount: { type: Number, default: 0, min: 0 },
  minimumAmount: { type: Number, default: 0, min: 0 },
  applicableCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  startsAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

couponSchema.pre("validate", function (next) {
  if (this.discountType === "percentage" && this.discountValue > 100) return next(new Error("Percentage discount cannot exceed 100"));
  next();
});

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
