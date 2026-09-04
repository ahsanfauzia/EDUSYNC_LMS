import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  educatorId: { type: String, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
}, { timestamps: true });

export default mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
