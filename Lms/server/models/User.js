import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  imageUrl: { type: String, default: "" },
  role: { type: String, enum: ["student", "educator", "admin"], default: "student", index: true },
  status: { type: String, enum: ["active", "suspended", "deleted"], default: "active", index: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  lastLoginAt: { type: Date, default: null },
  emailVerified: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
