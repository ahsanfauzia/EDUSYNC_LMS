import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  isCorrect: { type: Boolean, default: false },
}, { _id: false });

const questionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  lectureId: { type: String, required: true, index: true },
  question: { type: String, required: true, trim: true },
  options: { type: [optionSchema], required: true, validate: v => v.length >= 2 },
  explanation: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model("Question", questionSchema);
