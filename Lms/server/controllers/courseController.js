import Course from "../models/course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";


/* =========================================================
   CHECK WHETHER USER IS ENROLLED
========================================================= */

const isUserEnrolled = async (userId, courseId) => {
  if (!userId) return false;
  try {
    const enrollment = await Enrollment.exists({
      userId,
      courseId,
      status: { $in: ["active", "completed"] },
    });
    return Boolean(enrollment);
  } catch (error) {
    console.error("Enrollment Check Error:", error.message);
    return false;
  }
};

/* =========================================================
   GET ALL COURSES
========================================================= */

export const getAllCourses = async (
  req,
  res
) => {
  try {

    const courses =
      await Course.find({
        isPublished: true,
      })
        .select(
          "-courseContent -enrolledStudents"
        )
        .lean();


    return res.status(200).json({
      success: true,
      courses,
    });

  } catch (error) {

    console.error(
      "getAllCourses Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load courses",
    });
  }
};


/* =========================================================
   GET COURSE BY ID
========================================================= */

export const getCourseById = async (
  req,
  res
) => {
  try {

    const { id } =
      req.params;


    const courseData =
      await Course.findById(id)
        .lean();


    if (!courseData) {
      return res.status(404).json({
        success: false,
        message:
          "Course Not Found",
      });
    }


    /* -----------------------------------------------------
       GET CURRENT CLERK USER ID
    ----------------------------------------------------- */

    let userId = null;

    try {
      const auth =
        typeof req.auth === "function"
          ? req.auth()
          : null;

      userId =
        auth?.userId || null;

    } catch {
      userId = null;
    }


    /* -----------------------------------------------------
       CHECK ENROLLMENT
    ----------------------------------------------------- */

    const enrolled =
      await isUserEnrolled(
        userId,
        courseData._id
      );


    /* -----------------------------------------------------
       SANITIZE COURSE CONTENT
    ----------------------------------------------------- */

    courseData.courseContent =
      (
        courseData.courseContent ||
        []
      ).map(
        (chapter) => {

          return {
            ...chapter,

            chapterContent:
              (
                chapter.chapterContent ||
                []
              ).map(
                (lecture) => {

                  const safeLecture =
                    {
                      ...lecture,
                    };


                  /*
                   * FREE PREVIEW
                   *
                   * Keep preview video.
                   */

                  if (
                    lecture.isPreviewFree
                  ) {

                    if (
                      !safeLecture.previewVideoId &&
                      safeLecture.lectureUrl
                    ) {
                      safeLecture.previewVideoId =
                        safeLecture.lectureUrl;
                    }

                  }


                  /*
                   * NON-ENROLLED USER
                   *
                   * Hide paid video and notes.
                   */

                  if (!enrolled) {

                    if (
                      !lecture.isPreviewFree
                    ) {
                      safeLecture.lectureUrl =
                        "";
                    }

                    safeLecture.lectureNotes =
                      {
                        title: "",
                        url: "",
                        publicId: "",
                      };

                  }


                  /*
                   * ENROLLED USER
                   *
                   * Full content remains available.
                   */

                  return safeLecture;
                }
              ),
          };
        }
      );


    /*
     * Don't expose internal enrolled student list.
     */

    delete courseData.enrolledStudents;


    /*
     * Helpful flag for frontend.
     */

    courseData.isUserEnrolled =
      enrolled;


    return res.status(200).json({
      success: true,
      courseData,
    });

  } catch (error) {

    console.error(
      "getCourseById Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load course",
    });
  }
};