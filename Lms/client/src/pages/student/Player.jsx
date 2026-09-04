import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import YouTube from "react-youtube";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const Player = () => {
  const { id } = useParams();

  const {
    allCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userData,
    enrolledCourses,
  } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [playerVideo, setPlayerVideo] = useState("");
  const [currentLectureId, setCurrentLectureId] = useState("");
  const [currentLecture, setCurrentLecture] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  // =========================================================
  // VIDEO HELPERS
  // =========================================================

  const isYouTubeVideo = (url) => {
    if (!url) return false;

    return (
      url.includes("youtube.com") ||
      url.includes("youtu.be")
    );
  };

  const getVideoId = (url) => {
    if (!url) return "";

    if (url.includes("youtu.be/")) {
      return url
        .split("youtu.be/")[1]
        .split("?")[0]
        .split("&")[0];
    }

    if (url.includes("watch?v=")) {
      return url
        .split("watch?v=")[1]
        .split("&")[0];
    }

    if (url.includes("/embed/")) {
      return url
        .split("/embed/")[1]
        .split("?")[0]
        .split("&")[0];
    }

    return url;
  };

  const getLectureVideo = (lecture) => {
    if (!lecture?.lectureUrl) {
      return {
        type: "none",
        url: "",
      };
    }

    if (isYouTubeVideo(lecture.lectureUrl)) {
      return {
        type: "youtube",
        url: getVideoId(lecture.lectureUrl),
      };
    }

    return {
      type: "direct",
      url: lecture.lectureUrl,
    };
  };

  // =========================================================
  // LOAD COURSE
  // =========================================================

  useEffect(() => {
    if (!allCourses?.length) return;

    const course = allCourses.find(
      (item) => item._id === id
    );

    if (!course) return;

    setCourseData(course);

    if (
      course.courseContent?.length &&
      course.courseContent[0]?.chapterContent?.length
    ) {
      const firstLecture =
        course.courseContent[0].chapterContent[0];

      const video = getLectureVideo(firstLecture);

      setPlayerVideo(video.url);
      setCurrentLectureId(firstLecture.lectureId);
      setCurrentLecture(firstLecture);

      setOpenSections({
        0: true,
      });
    }

    course.courseRatings?.forEach((item) => {
      if (item.userId === userData?._id) {
        setInitialRating(item.rating);
      }
    });
  }, [allCourses, id, userData]);

  // =========================================================
  // TOGGLE CHAPTER
  // =========================================================

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // =========================================================
  // SELECT LECTURE
  // =========================================================

  const handleSelectLecture = (lecture) => {
    const video = getLectureVideo(lecture);

    setPlayerVideo(video.url);
    setCurrentLectureId(lecture.lectureId);
    setCurrentLecture(lecture);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // MARK LECTURE COMPLETE
  // =========================================================

  const markLectureAsComplete = async () => {
    if (!currentLectureId) {
      toast.error("Please select a lecture first.");
      return;
    }

    try {
      const token = await getToken();

      const { data } = await axios.post(
        backendUrl +
          "/api/user/update-course-progress",
        {
          courseId: id,
          lectureId: currentLectureId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update lecture progress."
      );
    }
  };

  // =========================================================
  // GET COURSE PROGRESS
  // =========================================================

  const getCourseProgress = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        backendUrl +
          "/api/user/get-course-progress",
        {
          courseId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setProgressData(data.progressData);
      }
    } catch (error) {
      console.error(
        "Course Progress Error:",
        error
      );
    }
  };

  // =========================================================
  // LOAD PROGRESS
  // =========================================================

  useEffect(() => {
    if (enrolledCourses?.length) {
      getCourseProgress();
    }
  }, [enrolledCourses, id]);

  // =========================================================
  // RATE COURSE
  // =========================================================

  const handleRate = async (rating) => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        {
          courseId: id,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setInitialRating(rating);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to rate this course."
      );
    }
  };

  // =========================================================
  // COURSE STATS
  // =========================================================

  const totalLectures = useMemo(() => {
    return (
      courseData?.courseContent?.reduce(
        (total, chapter) =>
          total +
          (chapter.chapterContent?.length || 0),
        0
      ) || 0
    );
  }, [courseData]);

  const completedLectures =
    progressData?.lectureCompleted?.length || 0;

  const progressPercentage = totalLectures
    ? Math.min(
        100,
        Math.round(
          (completedLectures / totalLectures) * 100
        )
      )
    : 0;

  // =========================================================
  // LOADING
  // =========================================================

  if (!courseData) {
    return (
      <main
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          bg-[#FAF9F6]
          px-5
        "
      >
        <div className="text-center">

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              animate-pulse
              items-center
              justify-center
              rounded-2xl
              bg-[#F5E8C8]
              text-[#8B672B]
            "
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="12"
                cy="12"
                r="8"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </div>

          <p
            className="
              mt-4
              text-sm
              font-semibold
              text-[#64748B]
            "
          >
            Loading your course...
          </p>

        </div>
      </main>
    );
  }

  // =========================================================
  // YOUTUBE OPTIONS
  // =========================================================

  const youtubeOptions = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">

      {/* ===================================================== */}
      {/* PLAYER HEADER */}
      {/* ===================================================== */}

      <section className="bg-[#0F172A]">

        <div
          className="
            mx-auto
            max-w-[1440px]
            px-5
            py-5
            sm:px-8
            lg:px-12
            xl:px-16
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#D4AF6A]
                text-xs
                font-black
                text-[#0F172A]
              "
            >
              ES
            </div>

            <div className="min-w-0">

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[1.5px]
                  text-[#D4AF6A]
                "
              >
                Now Learning
              </p>

              <h1
                className="
                  mt-1
                  truncate
                  text-sm
                  font-bold
                  text-white
                  sm:text-base
                "
              >
                {courseData.courseTitle}
              </h1>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* MAIN PLAYER AREA */}
      {/* ===================================================== */}

      <main
        className="
          mx-auto
          max-w-[1440px]
          px-5
          py-8
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >

        <div
          className="
            grid
            gap-8
            lg:grid-cols-[1fr_370px]
          "
        >

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="min-w-0">

            {/* Video */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                bg-black
                shadow-[0_20px_50px_rgba(15,23,42,0.15)]
              "
            >

              <div
                className="
                  relative
                  aspect-video
                  w-full
                  bg-[#020617]
                "
              >

                {playerVideo &&
                isYouTubeVideo(
                  currentLecture?.lectureUrl || ""
                ) ? (

                  <div className="absolute inset-0">

                    <YouTube
                      videoId={playerVideo}
                      opts={youtubeOptions}
                      className="h-full w-full"
                      iframeClassName="h-full w-full"
                    />

                  </div>

                ) : playerVideo ? (

                  <video
                    key={playerVideo}
                    src={playerVideo}
                    controls
                    playsInline
                    className="
                      h-full
                      w-full
                      object-contain
                    "
                  />

                ) : (

                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                      text-center
                    "
                  >

                    <div>

                      <div
                        className="
                          mx-auto
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          bg-white/10
                          text-[#D4AF6A]
                        "
                      >

                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M8 5L19 12L8 19V5Z"
                            fill="currentColor"
                          />
                        </svg>

                      </div>

                      <p
                        className="
                          mt-4
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        No video available
                      </p>

                    </div>

                  </div>

                )}

              </div>

            </div>


            {/* Current lecture info */}

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-[#E7E5E0]
                bg-white
                p-5
                sm:p-6
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-start
                  sm:justify-between
                "
              >

                <div className="min-w-0">

                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[1.5px]
                      text-[#B88A3B]
                    "
                  >
                    Current Lecture
                  </p>

                  <h2
                    className="
                      mt-2
                      text-xl
                      font-black
                      tracking-[-0.3px]
                      text-[#0F172A]
                    "
                  >
                    {currentLecture?.lectureTitle ||
                      "Select a lecture"}
                  </h2>

                  {currentLecture?.lectureDuration !==
                    undefined && (
                    <p
                      className="
                        mt-2
                        text-xs
                        font-medium
                        text-[#94A3B8]
                      "
                    >
                      {humanizeDuration(
                        currentLecture.lectureDuration *
                          60000,
                        {
                          units: ["h", "m"],
                          round: true,
                        }
                      )}
                    </p>
                  )}

                </div>


                <button
                  onClick={markLectureAsComplete}
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#0F172A]
                    px-5
                    py-3
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-[#1B263B]
                    active:scale-[0.98]
                  "
                >

                  <span
                    className="
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[#D4AF6A]
                      text-[10px]
                      font-black
                      text-[#0F172A]
                    "
                  >
                    ✓
                  </span>

                  Mark Complete

                </button>

              </div>


              {/* Notes */}

              {currentLecture?.lectureNotes?.url && (
                <a
                  href={
                    currentLecture.lectureNotes.url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="
                    mt-5
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[#E7E5E0]
                    bg-[#FAF9F6]
                    p-3
                    transition
                    hover:border-[#D4AF6A]/50
                  "
                >

                  <span
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#F5E8C8]
                      text-[#8B672B]
                    "
                  >

                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <path
                        d="M6 3H14L19 8V21H6V3Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M14 3V8H19"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </span>

                  <div className="min-w-0">

                    <p
                      className="
                        text-xs
                        font-bold
                        text-[#0F172A]
                      "
                    >
                      {currentLecture.lectureNotes.title ||
                        "Lecture Notes"}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[10px]
                        text-[#94A3B8]
                      "
                    >
                      Open PDF notes
                    </p>

                  </div>

                  <svg
                    className="
                      ml-auto
                      shrink-0
                      text-[#8B672B]
                    "
                    width="16"
                    height="16"
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

                </a>
              )}

            </div>


            {/* ================================================= */}
            {/* CURRICULUM */}
            {/* ================================================= */}

            <div className="mt-8">

              <div className="mb-5">

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[2px]
                    text-[#B88A3B]
                  "
                >
                  Course Curriculum
                </p>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-black
                    tracking-[-0.5px]
                    text-[#0F172A]
                  "
                >
                  Continue learning
                </h2>

              </div>


              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E7E5E0]
                  bg-white
                "
              >

                {courseData.courseContent?.map(
                  (chapter, index) => {
                    const isOpen =
                      openSections[index];

                    return (
                      <div
                        key={
                          chapter.chapterId || index
                        }
                        className="
                          border-b
                          border-[#E7E5E0]
                          last:border-b-0
                        "
                      >

                        {/* Chapter header */}

                        <button
                          onClick={() =>
                            toggleSection(index)
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
                                text-[10px]
                                font-black
                                ${
                                  isOpen
                                    ? "bg-[#D4AF6A] text-[#0F172A]"
                                    : "bg-[#F5E8C8] text-[#8B672B]"
                                }
                              `}
                            >
                              {String(index + 1).padStart(
                                2,
                                "0"
                              )}
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
                                {chapter.chapterContent
                                  ?.length || 0}{" "}
                                lectures
                                {" • "}
                                {calculateChapterTime(
                                  chapter
                                )}
                              </p>

                            </div>

                          </div>


                          <svg
                            width="17"
                            height="17"
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


                        {/* Lectures */}

                        {isOpen && (
                          <div
                            className="
                              border-t
                              border-[#E7E5E0]
                              bg-[#FAF9F6]
                            "
                          >

                            {chapter.chapterContent?.map(
                              (lecture) => {
                                const completed =
                                  progressData?.lectureCompleted?.includes(
                                    lecture.lectureId
                                  );

                                const selected =
                                  currentLectureId ===
                                  lecture.lectureId;

                                return (
                                  <div
                                    key={
                                      lecture.lectureId
                                    }
                                    className={`
                                      flex
                                      items-center
                                      gap-3
                                      border-b
                                      border-[#E7E5E0]
                                      px-4
                                      py-3.5
                                      transition
                                      last:border-b-0
                                      sm:px-5
                                      ${
                                        selected
                                          ? "bg-[#F5E8C8]/45"
                                          : "hover:bg-white"
                                      }
                                    `}
                                  >

                                    {/* Play / completed */}

                                    <button
                                      onClick={() =>
                                        handleSelectLecture(
                                          lecture
                                        )
                                      }
                                      className={`
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        transition
                                        ${
                                          completed
                                            ? "bg-[#0F172A] text-[#D4AF6A]"
                                            : selected
                                            ? "bg-[#D4AF6A] text-[#0F172A]"
                                            : "bg-white text-[#64748B]"
                                        }
                                      `}
                                    >

                                      {completed ? (
                                        <svg
                                          width="15"
                                          height="15"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                        >
                                          <path
                                            d="M5 12L10 17L19 7"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          width="14"
                                          height="14"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M8 5L19 12L8 19V5Z" />
                                        </svg>
                                      )}

                                    </button>


                                    {/* Lecture info */}

                                    <button
                                      onClick={() =>
                                        handleSelectLecture(
                                          lecture
                                        )
                                      }
                                      className="
                                        min-w-0
                                        flex-1
                                        text-left
                                      "
                                    >

                                      <p
                                        className={`
                                          truncate
                                          text-xs
                                          font-bold
                                          ${
                                            selected
                                              ? "text-[#8B672B]"
                                              : "text-[#475569]"
                                          }
                                        `}
                                      >
                                        {lecture.lectureTitle}
                                      </p>

                                      <div
                                        className="
                                          mt-1
                                          flex
                                          flex-wrap
                                          items-center
                                          gap-2
                                        "
                                      >

                                        <span
                                          className="
                                            text-[9px]
                                            font-medium
                                            text-[#94A3B8]
                                          "
                                        >
                                          {humanizeDuration(
                                            lecture.lectureDuration *
                                              60000,
                                            {
                                              units: [
                                                "h",
                                                "m",
                                              ],
                                              round: true,
                                            }
                                          )}
                                        </span>


                                        {lecture.isPreviewFree && (
                                          <span
                                            className="
                                              rounded-full
                                              bg-[#F5E8C8]
                                              px-2
                                              py-0.5
                                              text-[8px]
                                              font-black
                                              uppercase
                                              tracking-[0.7px]
                                              text-[#8B672B]
                                            "
                                          >
                                            Preview
                                          </span>
                                        )}

                                      </div>

                                    </button>


                                    {/* Completion */}

                                    {completed ? (
                                      <span
                                        className="
                                          hidden
                                          rounded-full
                                          border
                                          border-[#D4AF6A]/30
                                          bg-white
                                          px-2.5
                                          py-1
                                          text-[8px]
                                          font-black
                                          uppercase
                                          tracking-[0.8px]
                                          text-[#8B672B]
                                          sm:inline-flex
                                        "
                                      >
                                        Completed
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          handleSelectLecture(
                                            lecture
                                          );
                                        }}
                                        className="
                                          hidden
                                          rounded-lg
                                          border
                                          border-[#E7E5E0]
                                          bg-white
                                          px-3
                                          py-1.5
                                          text-[9px]
                                          font-bold
                                          text-[#64748B]
                                          transition
                                          hover:border-[#D4AF6A]
                                          hover:text-[#8B672B]
                                          sm:block
                                        "
                                      >
                                        Watch
                                      </button>
                                    )}

                                  </div>
                                );
                              }
                            )}

                          </div>
                        )}

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ================================================= */}

          <aside>

            <div
              className="
                sticky
                top-24
                space-y-5
              "
            >

              {/* Course card */}

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E7E5E0]
                  bg-white
                  shadow-[0_10px_30px_rgba(15,23,42,0.05)]
                "
              >

                <div className="relative h-44">

                  <img
                    src={courseData.courseThumbnail}
                    alt={courseData.courseTitle}
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
                      from-[#0F172A]/60
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-4
                      left-4
                      rounded-lg
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
                    Your Course
                  </div>

                </div>


                <div className="p-5">

                  <h2
                    className="
                      line-clamp-2
                      text-base
                      font-black
                      leading-6
                      text-[#0F172A]
                    "
                  >
                    {courseData.courseTitle}
                  </h2>


                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
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
                      Course Progress
                    </span>

                    <span
                      className="
                        text-sm
                        font-black
                        text-[#8B672B]
                      "
                    >
                      {progressPercentage}%
                    </span>

                  </div>


                  {/* Progress bar */}

                  <div
                    className="
                      mt-2
                      h-2
                      overflow-hidden
                      rounded-full
                      bg-[#E7E5E0]
                    "
                  >

                    <div
                      className="
                        h-full
                        rounded-full
                        bg-[#D4AF6A]
                        transition-all
                        duration-500
                      "
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />

                  </div>


                  <p
                    className="
                      mt-2
                      text-[10px]
                      font-medium
                      text-[#94A3B8]
                    "
                  >
                    {completedLectures} of{" "}
                    {totalLectures} lectures completed
                  </p>

                </div>

              </div>


              {/* Rating */}

              <div
                className="
                  rounded-2xl
                  border
                  border-[#E7E5E0]
                  bg-white
                  p-5
                "
              >

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[1.5px]
                    text-[#B88A3B]
                  "
                >
                  Course Feedback
                </p>

                <h3
                  className="
                    mt-2
                    text-base
                    font-black
                    text-[#0F172A]
                  "
                >
                  Rate your experience
                </h3>

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    gap-1
                  "
                >

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        onClick={() =>
                          handleRate(star)
                        }
                        aria-label={`Rate ${star} stars`}
                        className="
                          text-2xl
                          transition
                          hover:scale-110
                        "
                      >

                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 20 20"
                          className={
                            star <= initialRating
                              ? "fill-[#D4AF6A]"
                              : "fill-[#E2E8F0]"
                          }
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
                        </svg>

                      </button>
                    )
                  )}

                </div>

                <p
                  className="
                    mt-3
                    text-[10px]
                    text-[#94A3B8]
                  "
                >
                  Your rating helps other learners choose
                  the right course.
                </p>

              </div>


              {/* Learning stats */}

              <div
                className="
                  rounded-2xl
                  bg-[#0F172A]
                  p-5
                  text-white
                "
              >

                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[1.5px]
                    text-[#D4AF6A]
                  "
                >
                  Keep going
                </p>

                <h3
                  className="
                    mt-2
                    text-lg
                    font-black
                    leading-6
                  "
                >
                  Progress is built one
                  lesson at a time.
                </h3>

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#D4AF6A]
                      text-[#0F172A]
                    "
                  >
                    ✓
                  </div>

                  <p
                    className="
                      text-[10px]
                      font-medium
                      leading-5
                      text-[#CBD5E1]
                    "
                  >
                    Complete your next lecture and
                    keep your learning streak moving.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>


      <Footer />

    </div>
  );
};

export default Player;