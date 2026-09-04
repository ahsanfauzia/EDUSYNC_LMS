import Course from "../models/course.js";
import Purchase from "../models/purchase.js";
import User from "../models/User.js";

import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";


// =====================================================
// HELPER: ENSURE MONGODB USER EXISTS
// =====================================================

const ensureMongoUser = async (userId) => {
  let user = await User.findById(userId);

  if (user) {
    return user;
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  user = await User.create({
    _id: clerkUser.id,

    name:
      `${clerkUser.firstName || ""} ${
        clerkUser.lastName || ""
      }`.trim() || "User",

    email:
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      `${clerkUser.id}@placeholder.local`,

    imageUrl: clerkUser.imageUrl || "",

    enrolledCourses: [],
    role: clerkUser.publicMetadata?.role || "student",
  });

  return user;
};


// =====================================================
// HELPER: GET EDUCATOR ID
// =====================================================

const getEducatorId = (req) => {
  return (
    req.educatorId ||
    req.userId ||
    req.auth()?.userId ||
    null
  );
};


// =====================================================
// HELPER: FIND COURSE OWNED BY EDUCATOR
// =====================================================

const getOwnedCourse = async (courseId, educatorId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    return {
      course: null,
      error: {
        status: 404,
        message: "Course not found",
      },
    };
  }

  if (
    String(course.educator) !==
    String(educatorId)
  ) {
    return {
      course: null,
      error: {
        status: 403,
        message:
          "You can only manage your own courses",
      },
    };
  }

  return {
    course,
    error: null,
  };
};


// =====================================================
// UPDATE ROLE TO EDUCATOR
// =====================================================

export const updateRoleToEducator = async (
  req,
  res
) => {
  try {
    const userId = req.auth()?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in first.",
      });
    }

    await clerkClient.users.updateUser(
      userId,
      {
        publicMetadata: {
          role: "educator",
        },
      }
    );

    await User.findByIdAndUpdate(
      userId,
      { role: "educator", status: "active" },
      { upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({
      success: true,
      message:
        "You can publish a course now",
      role: "educator",
    });
  } catch (error) {
    console.error(
      "updateRoleToEducator Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update educator role",
    });
  }
};


// =====================================================
// ADD COURSE
// =====================================================

export const addCourse = async (
  req,
  res
) => {
  try {
    const educatorId =
      getEducatorId(req);

    if (!educatorId) {
      return res.status(401).json({
        success: false,
        message:
          "Educator ID not found. Please sign in again.",
      });
    }

    await ensureMongoUser(
      educatorId
    );

    if (!req.body.courseData) {
      return res.status(400).json({
        success: false,
        message:
          "Course data is missing",
      });
    }

    let courseData;

    try {
      courseData = JSON.parse(
        req.body.courseData
      );
    } catch {
      return res.status(400).json({
        success: false,
        message:
          "Invalid course data",
      });
    }

    const {
      courseTitle,
      courseDescription,
      coursePrice,
      discount = 0,
      courseContent = [],
    } = courseData;

    if (!courseTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Course title is required",
      });
    }

    if (!courseDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Course description is required",
      });
    }

    if (
      !Number.isFinite(
        Number(coursePrice)
      ) ||
      Number(coursePrice) < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid course price is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Course thumbnail is required",
      });
    }

    const result =
      await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "courses",
        }
      );

    const newCourse =
      await Course.create({
        courseTitle:
          courseTitle.trim(),

        courseDescription:
          courseDescription.trim(),

        coursePrice:
          Number(coursePrice),

        discount: Math.min(
          100,
          Math.max(
            0,
            Number(discount) || 0
          )
        ),

        courseThumbnail:
          result.secure_url,

        educator:
          educatorId,

        courseContent:
          Array.isArray(courseContent)
            ? courseContent
            : [],

        isPublished: true,
      });

    return res.status(201).json({
      success: true,
      message:
        "Course Added Successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error(
      "addCourse Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to add course",
    });
  }
};


// =====================================================
// GET EDUCATOR COURSES
// =====================================================

export const getEducatorCourses =
  async (req, res) => {
    try {
      const educatorId =
        getEducatorId(req);

      if (!educatorId) {
        return res.status(401).json({
          success: false,
          message:
            "Educator ID not found.",
        });
      }

      const courses =
        await Course.find({
          educator: educatorId,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.json({
        success: true,
        courses,
      });
    } catch (error) {
      console.error(
        "getEducatorCourses Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// =====================================================
// UPDATE BASIC COURSE DETAILS
// =====================================================

export const updateCourse = async (
  req,
  res
) => {
  try {
    const educatorId =
      getEducatorId(req);

    const { id } = req.params;

    if (!educatorId) {
      return res.status(401).json({
        success: false,
        message:
          "User not authenticated",
      });
    }

    const result =
      await getOwnedCourse(
        id,
        educatorId
      );

    if (result.error) {
      return res.status(
        result.error.status
      ).json({
        success: false,
        message:
          result.error.message,
      });
    }

    const course =
      result.course;

    const {
      courseTitle,
      courseDescription,
      coursePrice,
      discount,
      isPublished,
    } = req.body;

    if (
      courseTitle !== undefined
    ) {
      if (!courseTitle.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Course title is required",
        });
      }

      course.courseTitle =
        courseTitle.trim();
    }

    if (
      courseDescription !==
      undefined
    ) {
      if (
        !courseDescription.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Course description is required",
        });
      }

      course.courseDescription =
        courseDescription.trim();
    }

    if (
      coursePrice !== undefined
    ) {
      if (
        !Number.isFinite(
          Number(coursePrice)
        ) ||
        Number(coursePrice) < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid course price is required",
        });
      }

      course.coursePrice =
        Number(coursePrice);
    }

    if (
      discount !== undefined
    ) {
      if (
        !Number.isFinite(
          Number(discount)
        ) ||
        Number(discount) < 0 ||
        Number(discount) > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Discount must be between 0 and 100",
        });
      }

      course.discount =
        Number(discount);
    }

    if (
      isPublished !== undefined
    ) {
      course.isPublished =
        Boolean(isPublished);
    }

    // Thumbnail update
    if (req.file) {
      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "courses",
          }
        );

      course.courseThumbnail =
        result.secure_url;
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message:
        "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error(
      "updateCourse Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update course",
    });
  }
};


// =====================================================
// ADD CHAPTER
// =====================================================

export const addChapter = async (
  req,
  res
) => {
  try {
    const educatorId =
      getEducatorId(req);

    const { courseId } =
      req.params;

    if (!educatorId) {
      return res.status(401).json({
        success: false,
        message:
          "User not authenticated",
      });
    }

    const result =
      await getOwnedCourse(
        courseId,
        educatorId
      );

    if (result.error) {
      return res.status(
        result.error.status
      ).json({
        success: false,
        message:
          result.error.message,
      });
    }

    const course =
      result.course;

    const {
      chapterTitle,
    } = req.body;

    if (!chapterTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Chapter title is required",
      });
    }

    const chapterId =
      `chapter_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    const chapterOrder =
      course.courseContent.length + 1;

    course.courseContent.push({
      chapterId,

      chapterOrder,

      chapterTitle:
        chapterTitle.trim(),

      chapterContent: [],
    });

    await course.save();

    return res.status(201).json({
      success: true,
      message:
        "Chapter added successfully",

      chapter:
        course.courseContent[
          course.courseContent.length - 1
        ],

      course,
    });
  } catch (error) {
    console.error(
      "addChapter Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to add chapter",
    });
  }
};


// =====================================================
// UPDATE CHAPTER
// =====================================================

export const updateChapter =
  async (req, res) => {
    try {
      const educatorId =
        getEducatorId(req);

      const {
        courseId,
        chapterId,
      } = req.params;

      const result =
        await getOwnedCourse(
          courseId,
          educatorId
        );

      if (result.error) {
        return res.status(
          result.error.status
        ).json({
          success: false,
          message:
            result.error.message,
        });
      }

      const course =
        result.course;

      const chapter =
        course.courseContent.find(
          (item) =>
            item.chapterId ===
            chapterId
        );

      if (!chapter) {
        return res.status(404).json({
          success: false,
          message:
            "Chapter not found",
        });
      }

      const {
        chapterTitle,
        chapterOrder,
      } = req.body;

      if (
        chapterTitle !==
        undefined
      ) {
        if (!chapterTitle.trim()) {
          return res.status(400).json({
            success: false,
            message:
              "Chapter title is required",
          });
        }

        chapter.chapterTitle =
          chapterTitle.trim();
      }

      if (
        chapterOrder !==
        undefined
      ) {
        chapter.chapterOrder =
          Number(chapterOrder);
      }

      await course.save();

      return res.json({
        success: true,
        message:
          "Chapter updated successfully",
        chapter,
        course,
      });
    } catch (error) {
      console.error(
        "updateChapter Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to update chapter",
      });
    }
  };


// =====================================================
// DELETE CHAPTER
// =====================================================

export const deleteChapter =
  async (req, res) => {
    try {
      const educatorId =
        getEducatorId(req);

      const {
        courseId,
        chapterId,
      } = req.params;

      const result =
        await getOwnedCourse(
          courseId,
          educatorId
        );

      if (result.error) {
        return res.status(
          result.error.status
        ).json({
          success: false,
          message:
            result.error.message,
        });
      }

      const course =
        result.course;

      const chapterIndex =
        course.courseContent.findIndex(
          (item) =>
            item.chapterId ===
            chapterId
        );

      if (chapterIndex === -1) {
        return res.status(404).json({
          success: false,
          message:
            "Chapter not found",
        });
      }

      course.courseContent.splice(
        chapterIndex,
        1
      );

      course.courseContent.forEach(
        (chapter, index) => {
          chapter.chapterOrder =
            index + 1;
        }
      );

      await course.save();

      return res.json({
        success: true,
        message:
          "Chapter deleted successfully",
        course,
      });
    } catch (error) {
      console.error(
        "deleteChapter Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to delete chapter",
      });
    }
  };


// =====================================================
// ADD LECTURE
// =====================================================

export const addLecture = async (
  req,
  res
) => {
  try {
    const educatorId =
      getEducatorId(req);

    const {
      courseId,
      chapterId,
    } = req.params;

    const result =
      await getOwnedCourse(
        courseId,
        educatorId
      );

    if (result.error) {
      return res.status(
        result.error.status
      ).json({
        success: false,
        message:
          result.error.message,
      });
    }

    const course =
      result.course;

    const chapter =
      course.courseContent.find(
        (item) =>
          item.chapterId ===
          chapterId
      );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message:
          "Chapter not found",
      });
    }

    const {
      lectureTitle,
      lectureDuration = 0,
      lectureUrl = "",
      previewVideoId = "",
      isPreviewFree = false,
    } = req.body;

    if (!lectureTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Lecture title is required",
      });
    }

    const lectureId =
      `lecture_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    chapter.chapterContent.push({
      lectureId,

      lectureTitle:
        lectureTitle.trim(),

      lectureDuration:
        Number(lectureDuration) || 0,

      lectureUrl:
        lectureUrl?.trim() || "",

      previewVideoId:
        previewVideoId?.trim() || "",

      isPreviewFree:
        Boolean(isPreviewFree),

      lectureNotes: {
        title: "",
        url: "",
        publicId: "",
      },
    });

    await course.save();

    const lecture =
      chapter.chapterContent[
        chapter.chapterContent.length - 1
      ];

    return res.status(201).json({
      success: true,
      message:
        "Lecture added successfully",
      lecture,
      course,
    });
  } catch (error) {
    console.error(
      "addLecture Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to add lecture",
    });
  }
};


// =====================================================
// UPDATE LECTURE
// =====================================================

export const updateLecture =
  async (req, res) => {
    try {
      const educatorId =
        getEducatorId(req);

      const {
        courseId,
        chapterId,
        lectureId,
      } = req.params;

      const result =
        await getOwnedCourse(
          courseId,
          educatorId
        );

      if (result.error) {
        return res.status(
          result.error.status
        ).json({
          success: false,
          message:
            result.error.message,
        });
      }

      const course =
        result.course;

      const chapter =
        course.courseContent.find(
          (item) =>
            item.chapterId ===
            chapterId
        );

      if (!chapter) {
        return res.status(404).json({
          success: false,
          message:
            "Chapter not found",
        });
      }

      const lecture =
        chapter.chapterContent.find(
          (item) =>
            item.lectureId ===
            lectureId
        );

      if (!lecture) {
        return res.status(404).json({
          success: false,
          message:
            "Lecture not found",
        });
      }

      const {
        lectureTitle,
        lectureDuration,
        lectureUrl,
        previewVideoId,
        isPreviewFree,
      } = req.body;

      if (
        lectureTitle !==
        undefined
      ) {
        if (!lectureTitle.trim()) {
          return res.status(400).json({
            success: false,
            message:
              "Lecture title is required",
          });
        }

        lecture.lectureTitle =
          lectureTitle.trim();
      }

      if (
        lectureDuration !==
        undefined
      ) {
        lecture.lectureDuration =
          Number(lectureDuration) || 0;
      }

      if (
        lectureUrl !==
        undefined
      ) {
        lecture.lectureUrl =
          lectureUrl?.trim() || "";
      }

      if (
        previewVideoId !==
        undefined
      ) {
        lecture.previewVideoId =
          previewVideoId?.trim() || "";
      }

      if (
        isPreviewFree !==
        undefined
      ) {
        lecture.isPreviewFree =
          Boolean(isPreviewFree);
      }

      await course.save();

      return res.json({
        success: true,
        message:
          "Lecture updated successfully",
        lecture,
        course,
      });
    } catch (error) {
      console.error(
        "updateLecture Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to update lecture",
      });
    }
  };


// =====================================================
// DELETE LECTURE
// =====================================================

export const deleteLecture =
  async (req, res) => {
    try {
      const educatorId =
        getEducatorId(req);

      const {
        courseId,
        chapterId,
        lectureId,
      } = req.params;

      const result =
        await getOwnedCourse(
          courseId,
          educatorId
        );

      if (result.error) {
        return res.status(
          result.error.status
        ).json({
          success: false,
          message:
            result.error.message,
        });
      }

      const course =
        result.course;

      const chapter =
        course.courseContent.find(
          (item) =>
            item.chapterId ===
            chapterId
        );

      if (!chapter) {
        return res.status(404).json({
          success: false,
          message:
            "Chapter not found",
        });
      }

      const lectureIndex =
        chapter.chapterContent.findIndex(
          (item) =>
            item.lectureId ===
            lectureId
        );

      if (lectureIndex === -1) {
        return res.status(404).json({
          success: false,
          message:
            "Lecture not found",
        });
      }

      chapter.chapterContent.splice(
        lectureIndex,
        1
      );

      await course.save();

      return res.json({
        success: true,
        message:
          "Lecture deleted successfully",
        course,
      });
    } catch (error) {
      console.error(
        "deleteLecture Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to delete lecture",
      });
    }
  };


// =====================================================
// UPLOAD NOTES / PDF
// =====================================================

export const uploadLectureNotes =
  async (req, res) => {
    try {
      const educatorId =
        getEducatorId(req);

      const {
        courseId,
        chapterId,
        lectureId,
      } = req.params;

      if (!educatorId) {
        return res.status(401).json({
          success: false,
          message:
            "User not authenticated",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Notes/PDF file is required",
        });
      }

      const result =
        await getOwnedCourse(
          courseId,
          educatorId
        );

      if (result.error) {
        return res.status(
          result.error.status
        ).json({
          success: false,
          message:
            result.error.message,
        });
      }

      const course =
        result.course;

      const chapter =
        course.courseContent.find(
          (item) =>
            item.chapterId ===
            chapterId
        );

      if (!chapter) {
        return res.status(404).json({
          success: false,
          message:
            "Chapter not found",
        });
      }

      const lecture =
        chapter.chapterContent.find(
          (item) =>
            item.lectureId ===
            lectureId
        );

      if (!lecture) {
        return res.status(404).json({
          success: false,
          message:
            "Lecture not found",
        });
      }

      const uploadResult =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder:
              "course-notes",
            resource_type: "raw",
          }
        );

      lecture.lectureNotes = {
        title:
          req.file.originalname ||
          "Course Notes",

        url:
          uploadResult.secure_url,

        publicId:
          uploadResult.public_id,
      };

      await course.save();

      return res.status(201).json({
        success: true,
        message:
          "Notes uploaded successfully",

        notes:
          lecture.lectureNotes,

        lecture,

        course,
      });
    } catch (error) {
      console.error(
        "uploadLectureNotes Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to upload notes",
      });
    }
  };


// =====================================================
// DELETE NOTES / PDF
// =====================================================

export const deleteLectureNotes =
  async (req, res) => {
    try {
      const educatorId =
        getEducatorId(req);

      const {
        courseId,
        chapterId,
        lectureId,
      } = req.params;

      const result =
        await getOwnedCourse(
          courseId,
          educatorId
        );

      if (result.error) {
        return res.status(
          result.error.status
        ).json({
          success: false,
          message:
            result.error.message,
        });
      }

      const course =
        result.course;

      const chapter =
        course.courseContent.find(
          (item) =>
            item.chapterId ===
            chapterId
        );

      if (!chapter) {
        return res.status(404).json({
          success: false,
          message:
            "Chapter not found",
        });
      }

      const lecture =
        chapter.chapterContent.find(
          (item) =>
            item.lectureId ===
            lectureId
        );

      if (!lecture) {
        return res.status(404).json({
          success: false,
          message:
            "Lecture not found",
        });
      }

      const publicId =
        lecture.lectureNotes
          ?.publicId;

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(
            publicId,
            {
              resource_type: "raw",
            }
          );
        } catch (cloudinaryError) {
          console.error(
            "Cloudinary Notes Delete Error:",
            cloudinaryError
          );
        }
      }

      lecture.lectureNotes = {
        title: "",
        url: "",
        publicId: "",
      };

      await course.save();

      return res.json({
        success: true,
        message:
          "Notes deleted successfully",
        lecture,
        course,
      });
    } catch (error) {
      console.error(
        "deleteLectureNotes Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to delete notes",
      });
    }
  };


// =====================================================
// EDUCATOR DASHBOARD
// =====================================================

export const educatorDashboardData =
  async (req, res) => {
    try {
      const educatorId =
        getEducatorId(req);

      if (!educatorId) {
        return res.status(401).json({
          success: false,
          message:
            "User not authenticated",
        });
      }

      const courses =
        await Course.find({
          educator: educatorId,
        });

      const courseIds =
        courses.map(
          (course) =>
            course._id
        );

      const purchases =
        await Purchase.find({
          courseId: {
            $in: courseIds,
          },

          status: "completed",
        }).populate(
          "courseId"
        );

      const totalEarnings =
        purchases.reduce(
          (sum, purchase) =>
            sum +
            Number(
              purchase.amount || 0
            ),
          0
        );

      const enrolledStudentsData =
        await Promise.all(
          purchases.map(
            async (purchase) => {
              try {
                const student =
                  await clerkClient.users.getUser(
                    purchase.userId
                  );

                return {
                  studentName:
                    `${student.firstName || ""} ${
                      student.lastName || ""
                    }`.trim() ||
                    "Student",

                  imageUrl:
                    student.imageUrl ||
                    "",

                  email:
                    student
                      .emailAddresses?.[0]
                      ?.emailAddress ||
                    "",

                  courseTitle:
                    purchase
                      .courseId
                      ?.courseTitle ||
                    "",
                };
              } catch {
                return {
                  studentName:
                    "Student",

                  imageUrl: "",

                  email: "",

                  courseTitle:
                    purchase
                      .courseId
                      ?.courseTitle ||
                    "",
                };
              }
            }
          )
        );

      return res.json({
        success: true,

        dashboardData: {
          totalCourses:
            courses.length,

          totalEarnings,

          enrolledStudentsData,
        },
      });
    } catch (error) {
      console.error(
        "educatorDashboardData Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// =====================================================
// GET ENROLLED STUDENTS
// =====================================================

export const getEnrolledStudentsData =
  async (req, res) => {
    try {
      const educatorId =
        getEducatorId(req);

      if (!educatorId) {
        return res.status(401).json({
          success: false,
          message:
            "User not authenticated",
        });
      }

      const courses =
        await Course.find({
          educator: educatorId,
        });

      const courseIds =
        courses.map(
          (course) =>
            course._id
        );

      const purchases =
        await Purchase.find({
          courseId: {
            $in: courseIds,
          },

          status: "completed",
        }).populate(
          "courseId"
        );

      const students =
        await Promise.all(
          purchases.map(
            async (purchase) => {
              try {
                const student =
                  await clerkClient.users.getUser(
                    purchase.userId
                  );

                return {
                  _id:
                    purchase._id,

                  studentName:
                    `${student.firstName || ""} ${
                      student.lastName || ""
                    }`.trim() ||
                    "Student",

                  imageUrl:
                    student.imageUrl ||
                    "",

                  email:
                    student
                      .emailAddresses?.[0]
                      ?.emailAddress ||
                    "",

                  courseTitle:
                    purchase
                      .courseId
                      ?.courseTitle ||
                    "",

                  amount:
                    purchase.amount,

                  createdAt:
                    purchase.createdAt,
                };
              } catch {
                return {
                  _id:
                    purchase._id,

                  studentName:
                    "Student",

                  imageUrl: "",

                  email: "",

                  courseTitle:
                    purchase
                      .courseId
                      ?.courseTitle ||
                    "",

                  amount:
                    purchase.amount,

                  createdAt:
                    purchase.createdAt,
                };
              }
            }
          )
        );

      return res.json({
        success: true,
        students,
      });
    } catch (error) {
      console.error(
        "getEnrolledStudentsData Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };