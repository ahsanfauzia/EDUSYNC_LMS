import mongoose from "mongoose";


/*
=====================================================
LECTURE NOTES SCHEMA
=====================================================
*/

const lectureNotesSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        default: "",
      },

      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },
    {
      _id: false,
    }
  );


/*
=====================================================
LECTURE SCHEMA
=====================================================
*/

const lectureSchema =
  new mongoose.Schema(
    {
      lectureId: {
        type: String,
        required: true,
      },

      lectureTitle: {
        type: String,
        required: true,
      },

      lectureDuration: {
        type: Number,
        default: 0,
      },

      lectureUrl: {
        type: String,
        default: "",
      },

      previewVideoId: {
        type: String,
        default: "",
      },

      isPreviewFree: {
        type: Boolean,
        default: false,
      },

      /*
      PDF / NOTES
      */

      lectureNotes: {
        type: lectureNotesSchema,
        default: () => ({
          title: "",
          url: "",
          publicId: "",
        }),
      },
    },
    {
      _id: false,
    }
  );


/*
=====================================================
CHAPTER SCHEMA
=====================================================
*/

const chapterSchema =
  new mongoose.Schema(
    {
      chapterId: {
        type: String,
        required: true,
      },

      chapterOrder: {
        type: Number,
        default: 1,
      },

      chapterTitle: {
        type: String,
        required: true,
      },

      chapterContent: {
        type: [lectureSchema],
        default: [],
      },
    },
    {
      _id: false,
    }
  );


/*
=====================================================
COURSE SCHEMA
=====================================================
*/

const courseSchema =
  new mongoose.Schema(
    {
      courseTitle: {
        type: String,
        required: true,
        trim: true,
      },

      courseDescription: {
        type: String,
        required: true,
      },

      coursePrice: {
        type: Number,
        required: true,
        min: 0,
      },

      discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      courseThumbnail: {
        type: String,
        required: true,
      },

      educator: {
        type: String,
        ref: "User",
        required: true,
        index: true,
      },

      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
        index: true,
      },

      subcategory: { type: String, trim: true, default: "" },
      level: { type: String, enum: ["beginner", "intermediate", "advanced", "all"], default: "all", index: true },
      language: { type: String, default: "English", trim: true },
      requirements: { type: [String], default: [] },
      learningOutcomes: { type: [String], default: [] },
      tags: { type: [String], default: [], index: true },
      slug: { type: String, trim: true, lowercase: true, unique: true, sparse: true, index: true },
      seoTitle: { type: String, default: "" },
      seoDescription: { type: String, default: "" },
      totalDuration: { type: Number, default: 0, min: 0 },
      certificateEnabled: { type: Boolean, default: true },
      featured: { type: Boolean, default: false, index: true },

      /*
      =================================================
      COURSE CONTENT

      Chapter
        ↓
      Lecture
        ↓
      Video URL
        ↓
      PDF Notes
      =================================================
      */

      courseContent: {
        type: [chapterSchema],
        default: [],
      },

      enrolledStudents: {
        type: [String],
        default: [],
      },

      courseRating: {
        type: [{ userId: String, rating: { type: Number, min: 1, max: 5 } }],
        default: [],
      },
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      ratingCount: { type: Number, default: 0, min: 0 },
      enrollmentCount: { type: Number, default: 0, min: 0 },
      publishedAt: { type: Date, default: null },

      isPublished: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );


courseSchema.pre("save", function (next) {
  const lectures = this.courseContent?.flatMap(chapter => chapter.chapterContent || []) || [];
  this.totalDuration = lectures.reduce((total, lecture) => total + (Number(lecture.lectureDuration) || 0), 0);
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) this.publishedAt = new Date();
  next();
});

courseSchema.index({ isPublished: 1, featured: 1, createdAt: -1 });
courseSchema.index({ category: 1, level: 1, isPublished: 1 });
courseSchema.index({ courseTitle: "text", courseDescription: "text", tags: "text" });

const Course =
  mongoose.models.Course ||
  mongoose.model(
    "Course",
    courseSchema
  );


export default Course;