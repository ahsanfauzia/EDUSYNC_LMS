import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
}, { timestamps: true });

wishlistSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
