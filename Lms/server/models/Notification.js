import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  type: { type: String, enum: ["system", "course", "payment", "certificate", "announcement"], default: "system" },
  link: { type: String, default: "" },
  isRead: { type: Boolean, default: false, index: true },
}, { timestamps: true });

notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
