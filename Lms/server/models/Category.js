import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true, maxlength: 100 },
  slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
  description: { type: String, trim: true, default: "" },
  imageUrl: { type: String, default: "" },
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
