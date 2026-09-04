import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const Enrollment = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    calculateNoOfLectures,
    navigate,
    userData,
    fetchUserEnrolledCourses,
    backendUrl,
    getToken,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  // =========================================================
  // GET PROGRESS OF ALL COURSES
  // =========================================================

  const getCourseProgress = async () => {
    try {
      const token = await getToken();

      const tempProgress = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            backendUrl + "/api/user/get-course-progress",
            {
              courseId: course._id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const totalLectures =
            calculateNoOfLectures(course);

          const lectureCompleted = data.success
            ? data.progressData?.lectureCompleted?.length || 0
            : 0;

          return {
            totalLectures,
            lectureCompleted,
          };
        })
      );

      setProgressArray(tempProgress);
    } catch (error) {
      console.error(
        "Course Progress Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load course progress."
      );
    }
  };

  // =========================================================
  // LOAD ENROLLED COURSES
  // =========================================================

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  // =========================================================
  // LOAD COURSE PROGRESS
  // =========================================================

  useEffect(() => {
    if (enrolledCourses.length) {
      getCourseProgress();
    } else {
      setProgressArray([]);
    }
  }, [enrolledCourses]);

  // =========================================================
  // SUMMARY STATS
  // =========================================================

  const totalCourses = enrolledCourses.length;

  const completedCourses = enrolledCourses.filter(
    (_, index) => {
      const progress = progressArray[index];

      if (!progress || !progress.totalLectures) {
        return false;
      }

      return (
        (progress.lectureCompleted /
          progress.totalLectures) *
          100 >=
        100
      );
    }
  ).length;

  const totalLectures = progressArray.reduce(
    (total, item) =>
      total + (item?.totalLectures || 0),
    0
  );

  const completedLectures = progressArray.reduce(
    (total, item) =>
      total + (item?.lectureCompleted || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6]">

      {/* ===================================================== */}
      {/* PAGE HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#0F172A]">

        <div
          className="
            pointer-events-none
            absolute
            -right-40
            -top-40
            h-96
            w-96
            rounded-full
            bg-[#D4AF6A]/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-40
            bottom-[-180px]
            h-96
            w-96
            rounded-full
            bg-white/5
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-[1440px]
            px-5
            py-12
            sm:px-8
            lg:px-12
            lg:py-16
            xl:px-16
          "
        >

          {/* Breadcrumb */}

          <div
            className="
              mb-6
              flex
              items-center
              gap-2
              text-[11px]
              font-medium
              text-[#94A3B8]
            "
          >

            <button
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
              className="transition hover:text-[#D4AF6A]"
            >
              Home
            </button>

            <span>/</span>

            <span className="text-[#D4AF6A]">
              My Learning
            </span>

          </div>


          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            {/* Heading */}

            <div className="max-w-[700px]">

              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-3
                "
              >

                <span
                  className="
                    h-px
                    w-10
                    bg-[#D4AF6A]
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[2.5px]
                    text-[#D4AF6A]
                  "
                >
                  Your Learning Space
                </span>

              </div>


              <h1
                className="
                  text-3xl
                  font-black
                  tracking-[-1px]
                  text-white
                  sm:text-4xl
                  lg:text-[46px]
                "
              >
                My Learning
              </h1>


              <p
                className="
                  mt-4
                  max-w-[620px]
                  text-sm
                  leading-7
                  text-[#CBD5E1]
                  sm:text-base
                "
              >
                Pick up where you left off, track your
                progress, and keep building your skills
                one lesson at a time.
              </p>

            </div>


            {/* Summary */}

            <div
              className="
                flex
                w-full
                max-w-[430px]
                items-center
                divide-x
                divide-white/10
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-4
                backdrop-blur-sm
              "
            >

              <div className="flex-1 px-3 text-center">

                <p
                  className="
                    text-2xl
                    font-black
                    text-white
                  "
                >
                  {totalCourses}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[1px]
                    text-[#94A3B8]
                  "
                >
                  Courses
                </p>

              </div>


              <div className="flex-1 px-3 text-center">

                <p
                  className="
                    text-2xl
                    font-black
                    text-[#D4AF6A]
                  "
                >
                  {completedCourses}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[1px]
                    text-[#94A3B8]
                  "
                >
                  Completed
                </p>

              </div>


              <div className="flex-1 px-3 text-center">

                <p
                  className="
                    text-2xl
                    font-black
                    text-white
                  "
                >
                  {completedLectures}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[1px]
                    text-[#94A3B8]
                  "
                >
                  Lessons Done
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <main
        className="
          mx-auto
          max-w-[1440px]
          px-5
          py-10
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >

        {enrolledCourses.length > 0 ? (

          <>
            {/* Section header */}

            <div
              className="
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[2px]
                    text-[#B88A3B]
                  "
                >
                  Your Courses
                </p>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-black
                    tracking-[-0.5px]
                    text-[#0F172A]
                    sm:text-3xl
                  "
                >
                  Keep learning
                </h2>

              </div>


              <button
                onClick={() => {
                  navigate("/course-list");
                  window.scrollTo(0, 0);
                }}
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  text-[#8B672B]
                  transition
                  hover:text-[#0F172A]
                "
              >
                Explore more courses

                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <path
                    d="M13 6L19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

            </div>


            {/* ================================================= */}
            {/* COURSE CARDS */}
            {/* ================================================= */}

            <div
              className="
                mt-7
                grid
                grid-cols-1
                gap-5
                lg:grid-cols-2
              "
            >

              {enrolledCourses.map(
                (course, index) => {

                  const progress =
                    progressArray[index];

                  const total =
                    progress?.totalLectures || 0;

                  const completed =
                    progress?.lectureCompleted || 0;

                  const percent =
                    total > 0
                      ? Math.min(
                          100,
                          (completed / total) * 100
                        )
                      : 0;

                  const isCompleted =
                    percent >= 100;

                  return (
                    <article
                      key={course._id}
                      className="
                        group
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#E7E5E0]
                        bg-white
                        shadow-[0_8px_25px_rgba(15,23,42,0.04)]
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-[#D4AF6A]/40
                        hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          sm:flex-row
                        "
                      >

                        {/* Thumbnail */}

                        <div
                          className="
                            relative
                            h-52
                            shrink-0
                            overflow-hidden
                            sm:h-auto
                            sm:w-[230px]
                          "
                        >

                          <img
                            src={course.courseThumbnail}
                            alt={course.courseTitle}
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-500
                              group-hover:scale-105
                            "
                          />

                          <div
                            className="
                              absolute
                              inset-0
                              bg-gradient-to-t
                              from-[#0F172A]/50
                              via-transparent
                              to-transparent
                            "
                          />


                          {/* Status */}

                          <div
                            className={`
                              absolute
                              left-4
                              top-4
                              rounded-lg
                              px-3
                              py-1.5
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[1px]
                              ${
                                isCompleted
                                  ? "bg-[#D4AF6A] text-[#0F172A]"
                                  : "bg-[#0F172A]/85 text-white"
                              }
                            `}
                          >
                            {isCompleted
                              ? "Completed"
                              : "In Progress"}
                          </div>

                        </div>


                        {/* Content */}

                        <div
                          className="
                            flex
                            min-w-0
                            flex-1
                            flex-col
                            p-5
                          "
                        >

                          <p
                            className="
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-[1.3px]
                              text-[#B88A3B]
                            "
                          >
                            Enrolled Course
                          </p>


                          <h3
                            className="
                              mt-2
                              line-clamp-2
                              text-base
                              font-black
                              leading-6
                              text-[#0F172A]
                            "
                          >
                            {course.courseTitle}
                          </h3>


                          {/* Stats */}

                          <div
                            className="
                              mt-4
                              flex
                              flex-wrap
                              items-center
                              gap-x-4
                              gap-y-2
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-medium
                                text-[#64748B]
                              "
                            >

                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="8"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                />

                                <path
                                  d="M12 7V12L15 14"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>

                              {calculateCourseDuration(
                                course
                              )}

                            </div>


                            <div
                              className="
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-medium
                                text-[#64748B]
                              "
                            >

                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M4 6C4 4.9 4.9 4 6 4H20V18H6C4.9 18 4 18.9 4 20V6Z"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinejoin="round"
                                />

                                <path
                                  d="M8 8H16"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />

                                <path
                                  d="M8 12H15"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                              </svg>

                              {total}{" "}
                              {total === 1
                                ? "Lecture"
                                : "Lectures"}

                            </div>

                          </div>


                          {/* Progress */}

                          <div className="mt-5">

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-3
                              "
                            >

                              <span
                                className="
                                  text-[9px]
                                  font-bold
                                  uppercase
                                  tracking-[1px]
                                  text-[#94A3B8]
                                "
                              >
                                Your Progress
                              </span>

                              <span
                                className="
                                  text-xs
                                  font-black
                                  text-[#8B672B]
                                "
                              >
                                {percent.toFixed(0)}%
                              </span>

                            </div>


                            <div
                              className="
                                mt-2
                                overflow-hidden
                                rounded-full
                                bg-[#E7E5E0]
                              "
                            >

                              <Line
                                percent={percent}
                                strokeWidth={3}
                                strokeColor="#D4AF6A"
                                trailColor="#E7E5E0"
                                strokeLinecap="round"
                              />

                            </div>


                            <p
                              className="
                                mt-2
                                text-[9px]
                                font-medium
                                text-[#94A3B8]
                              "
                            >
                              {progress
                                ? `${completed}/${total} Lectures Completed`
                                : "Loading progress..."}
                            </p>

                          </div>


                          {/* CTA */}

                          <div
                            className="
                              mt-auto
                              pt-5
                            "
                          >

                            <button
                              onClick={() => {
                                navigate(
                                  "/player/" +
                                    course._id
                                );

                                window.scrollTo(
                                  0,
                                  0
                                );
                              }}
                              className={`
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                px-4
                                py-3
                                text-xs
                                font-black
                                transition
                                active:scale-[0.98]
                                ${
                                  isCompleted
                                    ? "bg-[#F5E8C8] text-[#8B672B] hover:bg-[#D4AF6A] hover:text-[#0F172A]"
                                    : "bg-[#0F172A] text-white hover:bg-[#1B263B]"
                                }
                              `}
                            >

                              {isCompleted
                                ? "Review Course"
                                : "Continue Learning"}

                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                              >

                                <path
                                  d="M5 12H19"
                                  stroke={
                                    isCompleted
                                      ? "currentColor"
                                      : "#D4AF6A"
                                  }
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />

                                <path
                                  d="M13 6L19 12L13 18"
                                  stroke={
                                    isCompleted
                                      ? "currentColor"
                                      : "#D4AF6A"
                                  }
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                              </svg>

                            </button>

                          </div>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>


            {/* ================================================= */}
            {/* TOTAL PROGRESS SUMMARY */}
            {/* ================================================= */}

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-[#E7E5E0]
                bg-white
                p-6
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[1.5px]
                      text-[#B88A3B]
                    "
                  >
                    Overall Learning Activity
                  </p>

                  <h3
                    className="
                      mt-2
                      text-lg
                      font-black
                      text-[#0F172A]
                    "
                  >
                    Keep your momentum going.
                  </h3>

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    bg-[#FAF9F6]
                    px-4
                    py-3
                  "
                >

                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#F5E8C8]
                      text-[#8B672B]
                    "
                  >
                    ✓
                  </span>

                  <div>

                    <p
                      className="
                        text-sm
                        font-black
                        text-[#0F172A]
                      "
                    >
                      {completedLectures}
                      <span
                        className="
                          font-medium
                          text-[#94A3B8]
                        "
                      >
                        {" "}
                        / {totalLectures}
                      </span>
                    </p>

                    <p
                      className="
                        text-[9px]
                        font-medium
                        text-[#94A3B8]
                      "
                    >
                      Lectures completed
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </>

        ) : (

          /* ================================================= */
          /* EMPTY STATE */
          /* ================================================= */

          <div
            className="
              flex
              min-h-[480px]
              items-center
              justify-center
              rounded-3xl
              border
              border-dashed
              border-[#D8D4CC]
              bg-white
              px-6
            "
          >

            <div className="max-w-[430px] text-center">

              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  bg-[#F5E8C8]
                  text-[#8B672B]
                "
              >

                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                >

                  <path
                    d="M4 5.5C4 4.67 4.67 4 5.5 4H19V19H5.5C4.67 19 4 18.33 4 17.5V5.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M8 8H15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8 12H15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                </svg>

              </div>


              <h2
                className="
                  mt-7
                  text-2xl
                  font-black
                  tracking-[-0.5px]
                  text-[#0F172A]
                "
              >
                Your learning journey starts here.
              </h2>


              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[#64748B]
                "
              >
                You haven't enrolled in any courses yet.
                Explore the library and find something
                worth learning today.
              </p>


              <button
                onClick={() => {
                  navigate("/course-list");
                  window.scrollTo(0, 0);
                }}
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#0F172A]
                  px-6
                  py-3.5
                  text-xs
                  font-black
                  text-white
                  transition
                  hover:bg-[#1B263B]
                  active:scale-[0.98]
                "
              >

                Browse Courses

                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                >

                  <path
                    d="M5 12H19"
                    stroke="#D4AF6A"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <path
                    d="M13 6L19 12L13 18"
                    stroke="#D4AF6A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

              </button>

            </div>

          </div>

        )}

      </main>


      <Footer />

    </div>
  );
};

export default Enrollment;