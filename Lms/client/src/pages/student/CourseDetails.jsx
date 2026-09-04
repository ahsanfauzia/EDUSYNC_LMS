import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    allCourses,
    calculateRating,
    currency,
    userData,
    enrolledCourses,
    enrollCourse,
  } = useContext(AppContext);

  const [course, setCourse] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const selectedCourse = allCourses?.find(
      (item) => item._id === id
    );

    setCourse(selectedCourse || null);
  }, [allCourses, id]);

  if (!course) {
    return (
      <main className="min-h-[70vh] bg-[#FAF9F6] px-5 py-20">
        <div className="mx-auto max-w-xl text-center">

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-[#F5E8C8]
              text-[#8B672B]
            "
          >
            <svg
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="11"
                cy="11"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M16 16L20 20"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-black text-[#0F172A]">
            Course not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            The course you're looking for may have been removed
            or is no longer available.
          </p>

          <button
            onClick={() => {
              navigate("/course-list");
              window.scrollTo(0, 0);
            }}
            className="
              mt-6
              rounded-xl
              bg-[#0F172A]
              px-6
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[#1B263B]
            "
          >
            Browse Courses
          </button>

        </div>
      </main>
    );
  }

  const rating = calculateRating(course);

  const discountedPrice = (
    course.coursePrice -
    (course.discount * course.coursePrice) / 100
  ).toFixed(2);

  const totalLectures =
    course.courseContent?.reduce(
      (total, chapter) =>
        total + (chapter.chapterContent?.length || 0),
      0
    ) || 0;

  const isEnrolled =
    enrolledCourses?.some(
      (enrolledCourse) =>
        enrolledCourse === course._id ||
        enrolledCourse?._id === course._id
    ) || course.enrolledStudents?.includes(userData?._id);

  const handleEnroll = async () => {
    if (!userData) {
      toast.info("Please login to enroll in this course.");
      return;
    }

    if (isEnrolled) {
      navigate(`/player/${course._id}`);
      return;
    }

    if (!enrollCourse) {
      toast.error("Enrollment service is unavailable.");
      return;
    }

    try {
      setIsEnrolling(true);

      await enrollCourse(course._id);

      toast.success("Course enrolled successfully!");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to enroll in this course."
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6]">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

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
            py-10
            sm:px-8
            lg:px-12
            lg:py-14
            xl:px-16
          "
        >

          {/* Breadcrumb */}

          <div
            className="
              mb-8
              flex
              flex-wrap
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
              className="hover:text-[#D4AF6A]"
            >
              Home
            </button>

            <span>/</span>

            <button
              onClick={() => {
                navigate("/course-list");
                window.scrollTo(0, 0);
              }}
              className="hover:text-[#D4AF6A]"
            >
              Courses
            </button>

            <span>/</span>

            <span className="max-w-[240px] truncate text-[#D4AF6A]">
              {course.courseTitle}
            </span>

          </div>


          <div
            className="
              grid
              gap-10
              lg:grid-cols-[1fr_430px]
              lg:items-center
            "
          >

            {/* LEFT */}

            <div>

              <div
                className="
                  mb-5
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >

                <span
                  className="
                    rounded-full
                    bg-[#D4AF6A]
                    px-3
                    py-1.5
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[1px]
                    text-[#0F172A]
                  "
                >
                  Featured Course
                </span>

                {course.discount > 0 && (
                  <span
                    className="
                      rounded-full
                      border
                      border-[#D4AF6A]/25
                      bg-white/5
                      px-3
                      py-1.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[1px]
                      text-[#D4AF6A]
                    "
                  >
                    {Math.round(course.discount)}% OFF
                  </span>
                )}

              </div>


              <h1
                className="
                  max-w-[820px]
                  text-3xl
                  font-black
                  leading-[1.15]
                  tracking-[-1px]
                  text-white
                  sm:text-4xl
                  lg:text-[48px]
                "
              >
                {course.courseTitle}
              </h1>


              <div
                className="
                  mt-5
                  max-w-[760px]
                  text-sm
                  leading-7
                  text-[#CBD5E1]
                  [&_p]:mb-2
                "
                dangerouslySetInnerHTML={{
                  __html: course.courseDescription,
                }}
              />


              {/* Rating */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-4
                "
              >

                <div className="flex items-center gap-2">

                  <span className="text-lg font-black text-[#D4AF6A]">
                    {rating.toFixed(1)}
                  </span>

                  <div className="flex gap-0.5">

                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        viewBox="0 0 20 20"
                        className={`
                          h-4
                          w-4
                          ${
                            index < Math.round(rating)
                              ? "fill-[#D4AF6A]"
                              : "fill-[#334155]"
                          }
                        `}
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
                      </svg>
                    ))}

                  </div>

                </div>


                <span className="h-4 w-px bg-white/15" />


                <span className="text-xs font-medium text-[#94A3B8]">
                  {course.enrolledStudents?.length || 0} learners enrolled
                </span>

              </div>


              {/* Course stats */}

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  gap-3
                "
              >

                <div
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                  "
                >
                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#64748B]">
                    Chapters
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {course.courseContent?.length || 0}
                  </p>
                </div>


                <div
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                  "
                >
                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#64748B]">
                    Lectures
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {totalLectures}
                  </p>
                </div>


                <div
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                  "
                >
                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#64748B]">
                    Learning
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Self-paced
                  </p>
                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* COURSE IMAGE / ENROLL CARD */}
            {/* ================================================= */}

            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white
                shadow-[0_25px_60px_rgba(0,0,0,0.25)]
              "
            >

              <div className="relative h-[230px] overflow-hidden">

                <img
                  src={course.courseThumbnail}
                  alt={course.courseTitle}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#0F172A]/40
                    to-transparent
                  "
                />

              </div>


              <div className="p-6">

                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[1.5px]
                    text-[#94A3B8]
                  "
                >
                  Course Investment
                </p>


                <div className="mt-2 flex items-end gap-3">

                  <span
                    className="
                      text-3xl
                      font-black
                      tracking-[-1px]
                      text-[#0F172A]
                    "
                  >
                    {currency}
                    {discountedPrice}
                  </span>

                  {course.discount > 0 && (
                    <span
                      className="
                        mb-1
                        text-sm
                        text-[#94A3B8]
                        line-through
                      "
                    >
                      {currency}
                      {course.coursePrice}
                    </span>
                  )}

                </div>


                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="
                    mt-6
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#0F172A]
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:bg-[#1B263B]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {isEnrolling
                    ? "Processing..."
                    : isEnrolled
                    ? "Continue Learning"
                    : "Enroll Now"}

                  {!isEnrolling && (
                    <svg
                      width="16"
                      height="16"
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
                  )}

                </button>


                <p
                  className="
                    mt-3
                    text-center
                    text-[10px]
                    font-medium
                    text-[#94A3B8]
                  "
                >
                  Instant access after enrollment
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section
        className="
          mx-auto
          max-w-[1440px]
          px-5
          py-12
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >

        <div
          className="
            grid
            gap-10
            lg:grid-cols-[1fr_360px]
          "
        >

          {/* ================================================= */}
          {/* CURRICULUM */}
          {/* ================================================= */}

          <div>

            <div className="mb-6">

              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-3
                "
              >
                <span className="h-px w-8 bg-[#D4AF6A]" />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[2px]
                    text-[#B88A3B]
                  "
                >
                  Course Curriculum
                </span>
              </div>


              <h2
                className="
                  text-2xl
                  font-black
                  tracking-[-0.5px]
                  text-[#0F172A]
                  sm:text-3xl
                "
              >
                Everything you'll learn
              </h2>

            </div>


            {/* Chapters */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[#E7E5E0]
                bg-white
              "
            >

              {course.courseContent?.length > 0 ? (
                course.courseContent.map((chapter, index) => {
                  const isOpen = expandedChapter === index;

                  return (
                    <div
                      key={chapter.chapterId || index}
                      className="
                        border-b
                        border-[#E7E5E0]
                        last:border-b-0
                      "
                    >

                      <button
                        onClick={() =>
                          setExpandedChapter(
                            isOpen ? -1 : index
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          gap-4
                          px-5
                          py-5
                          text-left
                          transition
                          hover:bg-[#FAF9F6]
                          sm:px-6
                        "
                      >

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-4
                          "
                        >

                          <span
                            className={`
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              text-xs
                              font-black
                              ${
                                isOpen
                                  ? "bg-[#D4AF6A] text-[#0F172A]"
                                  : "bg-[#F5E8C8] text-[#8B672B]"
                              }
                            `}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>


                          <div className="min-w-0">

                            <h3
                              className="
                                truncate
                                text-sm
                                font-extrabold
                                text-[#0F172A]
                              "
                            >
                              {chapter.chapterTitle}
                            </h3>

                            <p
                              className="
                                mt-1
                                text-[10px]
                                text-[#94A3B8]
                              "
                            >
                              {chapter.chapterContent?.length || 0}{" "}
                              {chapter.chapterContent?.length === 1
                                ? "lecture"
                                : "lectures"}
                            </p>

                          </div>

                        </div>


                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          className={`
                            shrink-0
                            text-[#64748B]
                            transition-transform
                            ${
                              isOpen
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        >
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                      </button>


                      {isOpen && (
                        <div
                          className="
                            border-t
                            border-[#E7E5E0]
                            bg-[#FAF9F6]
                            px-5
                            py-3
                            sm:px-6
                          "
                        >

                          {chapter.chapterContent?.map(
                            (lecture, lectureIndex) => (
                              <div
                                key={
                                  lecture.lectureId ||
                                  lectureIndex
                                }
                                className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-4
                                  border-b
                                  border-[#E7E5E0]
                                  py-4
                                  last:border-b-0
                                "
                              >

                                <div
                                  className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3
                                  "
                                >

                                  <span
                                    className="
                                      flex
                                      h-8
                                      w-8
                                      shrink-0
                                      items-center
                                      justify-center
                                      rounded-lg
                                      bg-white
                                      text-[#8B672B]
                                    "
                                  >

                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        d="M8 5L19 12L8 19V5Z"
                                        fill="currentColor"
                                      />
                                    </svg>

                                  </span>


                                  <span
                                    className="
                                      truncate
                                      text-xs
                                      font-semibold
                                      text-[#475569]
                                    "
                                  >
                                    {lecture.lectureTitle}
                                  </span>

                                </div>


                                <div
                                  className="
                                    flex
                                    shrink-0
                                    items-center
                                    gap-3
                                  "
                                >

                                  {lecture.isPreviewFree && (
                                    <span
                                      className="
                                        rounded-full
                                        bg-[#F5E8C8]
                                        px-2
                                        py-1
                                        text-[8px]
                                        font-black
                                        uppercase
                                        tracking-[0.8px]
                                        text-[#8B672B]
                                      "
                                    >
                                      Preview
                                    </span>
                                  )}

                                  <span
                                    className="
                                      text-[10px]
                                      font-medium
                                      text-[#94A3B8]
                                    "
                                  >
                                    {lecture.lectureDuration || 0} min
                                  </span>

                                </div>

                              </div>
                            )
                          )}

                        </div>
                      )}

                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center">

                  <p className="text-sm text-[#94A3B8]">
                    Course curriculum will be available soon.
                  </p>

                </div>
              )}

            </div>

          </div>


          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <aside>

            <div
              className="
                sticky
                top-24
                rounded-2xl
                border
                border-[#E7E5E0]
                bg-white
                p-6
                shadow-[0_10px_30px_rgba(15,23,42,0.05)]
              "
            >

              <h3
                className="
                  text-sm
                  font-black
                  text-[#0F172A]
                "
              >
                What you'll get
              </h3>


              <div className="mt-5 space-y-4">

                {[
                  "Full course access",
                  "Practical learning content",
                  "Self-paced learning",
                  "Lecture previews",
                  "Course notes and resources",
                ].map((item) => (
                  <div
                    key={item}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <span
                      className="
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F5E8C8]
                        text-[10px]
                        font-black
                        text-[#8B672B]
                      "
                    >
                      ✓
                    </span>

                    <span
                      className="
                        text-xs
                        font-medium
                        text-[#64748B]
                      "
                    >
                      {item}
                    </span>

                  </div>
                ))}

              </div>


              <div
                className="
                  my-6
                  h-px
                  bg-[#E7E5E0]
                "
              />


              <div
                className="
                  rounded-xl
                  bg-[#FAF9F6]
                  p-4
                "
              >

                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[1px]
                    text-[#94A3B8]
                  "
                >
                  Your progress starts here
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    font-bold
                    leading-5
                    text-[#0F172A]
                  "
                >
                  Learn one lesson at a time.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
};

export default CourseDetails;