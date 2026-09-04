import mongoose from "mongoose";

const educatorProfileSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true, unique: true, index: true },
  headline: { type: String, trim: true, maxlength: 160, default: "" },
  bio: { type: String, trim: true, maxlength: 5000, default: "" },
  expertise: { type: [String], default: [] },
  website: { type: String, trim: true, default: "" },
  socialLinks: {
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
  },
}, { timestamps: true });

export default mongoose.models.EducatorProfile || mongoose.model("EducatorProfile", educatorProfileSchema);
