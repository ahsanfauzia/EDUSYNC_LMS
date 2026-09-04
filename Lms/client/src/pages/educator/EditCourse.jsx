import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";

const EditCourse = () => {
  const {
    backendUrl,
    getToken,
    navigate,
  } = useContext(AppContext);

  // =====================================================
  // GET COURSE ID FROM URL
  // =====================================================

  const courseId =
    window.location.pathname.split("/").pop();

  // =====================================================
  // STATES
  // =====================================================

  const [courseTitle, setCourseTitle] =
    useState("");

  const [courseDescription, setCourseDescription] =
    useState("");

  const [coursePrice, setCoursePrice] =
    useState("");

  const [discount, setDiscount] =
    useState(0);

  const [isPublished, setIsPublished] =
    useState(false);

  const [thumbnail, setThumbnail] =
    useState(null);

  const [currentThumbnail, setCurrentThumbnail] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =====================================================
  // FETCH COURSE
  // =====================================================

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        toast.error(
          "Please login again."
        );
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/educator/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success) {
        toast.error(
          data.message ||
            "Unable to load course."
        );
        return;
      }

      const course =
        (data.courses || []).find(
          (item) =>
            String(item._id) ===
            String(courseId)
        );

      if (!course) {
        toast.error(
          "Course not found."
        );

        navigate(
          "/educator/my-courses"
        );

        return;
      }

      setCourseTitle(
        course.courseTitle || ""
      );

      setCourseDescription(
        course.courseDescription || ""
      );

      setCoursePrice(
        course.coursePrice ?? ""
      );

      setDiscount(
        course.discount ?? 0
      );

      setIsPublished(
        Boolean(course.isPublished)
      );

      setCurrentThumbnail(
        course.courseThumbnail || ""
      );

    } catch (error) {
      console.error(
        "EditCourse Fetch Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load course."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EFFECT
  // =====================================================

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  // =====================================================
  // SAVE COURSE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!courseTitle.trim()) {
      toast.error(
        "Course title is required."
      );
      return;
    }

    if (!courseDescription.trim()) {
      toast.error(
        "Course description is required."
      );
      return;
    }

    if (
      coursePrice === "" ||
      Number(coursePrice) < 0
    ) {
      toast.error(
        "Please enter a valid course price."
      );
      return;
    }

    if (
      Number(discount) < 0 ||
      Number(discount) > 100
    ) {
      toast.error(
        "Discount must be between 0 and 100."
      );
      return;
    }

    try {
      setSaving(true);

      const token = await getToken();

      if (!token) {
        toast.error(
          "Please login again."
        );
        return;
      }

      const formData =
        new FormData();

      formData.append(
        "courseTitle",
        courseTitle.trim()
      );

      formData.append(
        "courseDescription",
        courseDescription.trim()
      );

      formData.append(
        "coursePrice",
        Number(coursePrice)
      );

      formData.append(
        "discount",
        Number(discount) || 0
      );

      formData.append(
        "isPublished",
        isPublished
      );

      if (thumbnail) {
        formData.append(
          "image",
          thumbnail
        );
      }

      const { data } =
        await axios.put(
          `${backendUrl}/api/educator/course/${courseId}`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!data.success) {
        toast.error(
          data.message ||
            "Unable to update course."
        );
        return;
      }

      toast.success(
        data.message ||
          "Course updated successfully."
      );

      if (
        data.course?.courseThumbnail
      ) {
        setCurrentThumbnail(
          data.course.courseThumbnail
        );
      }

      setThumbnail(null);

    } catch (error) {
      console.error(
        "EditCourse Save Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update course."
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="w-full">

        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-[#0F172A]
            px-6
            py-8
            sm:px-8
          "
        >

          <div
            className="
              absolute
              -right-20
              -top-24
              h-72
              w-72
              rounded-full
              bg-[#D4AF6A]/10
              blur-3xl
            "
          />

          <div className="relative">

            <div className="flex items-center gap-3">

              <span className="h-px w-8 bg-[#D4AF6A]" />

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[2px]
                  text-[#D4AF6A]
                "
              >
                Course Management
              </span>

            </div>

            <h1
              className="
                mt-4
                text-2xl
                font-black
                tracking-tight
                text-white
              "
            >
              Edit Course
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-[#CBD5E1]
              "
            >
              Loading your course information...
            </p>

          </div>

        </section>


        <div
          className="
            mt-6
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-10
          "
        >

          <div className="flex flex-col items-center">

            <div
              className="
                h-10
                w-10
                animate-spin
                rounded-full
                border-2
                border-[#E7E5E0]
                border-t-[#D4AF6A]
              "
            />

            <p
              className="
                mt-4
                text-xs
                font-bold
                text-[#64748B]
              "
            >
              Loading course...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="w-full">

      {/* =================================================
          HEADER
      ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          bg-[#0F172A]
          px-6
          py-7
          sm:px-8
          sm:py-8
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-28
            h-80
            w-80
            rounded-full
            bg-[#D4AF6A]/10
            blur-3xl
          "
        />

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/educator/my-courses"
              )
            }
            className="
              mb-5
              flex
              items-center
              gap-2
              text-[10px]
              font-bold
              text-[#94A3B8]
              transition
              hover:text-[#D4AF6A]
            "
          >

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M11 6L5 12L11 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Back to My Courses

          </button>


          <div className="flex items-center gap-3">

            <span className="h-px w-9 bg-[#D4AF6A]" />

            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[2px]
                text-[#D4AF6A]
              "
            >
              Course Management
            </span>

          </div>


          <div
            className="
              mt-4
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            <div>

              <h1
                className="
                  text-2xl
                  font-black
                  tracking-[-0.7px]
                  text-white
                  sm:text-3xl
                "
              >
                Edit Course
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-[#CBD5E1]
                "
              >
                Update your course details,
                pricing, thumbnail, and
                publishing status.
              </p>

            </div>


            <div
              className={`
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                px-3
                py-2
                ${
                  isPublished
                    ? "border-emerald-400/20 bg-emerald-400/10"
                    : "border-[#D4AF6A]/20 bg-[#D4AF6A]/10"
                }
              `}
            >

              <span
                className={`
                  h-2
                  w-2
                  rounded-full
                  ${
                    isPublished
                      ? "bg-emerald-400"
                      : "bg-[#D4AF6A]"
                  }
                `}
              />

              <span
                className={`
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[1px]
                  ${
                    isPublished
                      ? "text-emerald-300"
                      : "text-[#D4AF6A]"
                  }
                `}
              >
                {isPublished
                  ? "Published"
                  : "Draft"}
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6"
      >

        {/* =================================================
            COURSE INFORMATION
        ================================================= */}

        <section
          className="
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            sm:p-7
          "
        >

          <div className="mb-6">

            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[1.7px]
                text-[#B88A3B]
              "
            >
              Course Details
            </p>

            <h2
              className="
                mt-1.5
                text-xl
                font-black
                text-[#0F172A]
              "
            >
              Basic information
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                text-[#94A3B8]
              "
            >
              Keep your course information
              clear and up to date.
            </p>

          </div>


          <div className="space-y-5">

            {/* TITLE */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[1px]
                  text-[#475569]
                "
              >
                Course Title
              </label>

              <input
                type="text"
                value={courseTitle}
                onChange={(e) =>
                  setCourseTitle(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D8D4CC]
                  bg-[#FAF9F6]
                  px-4
                  py-3.5
                  text-sm
                  font-semibold
                  text-[#0F172A]
                  outline-none
                  transition
                  focus:border-[#D4AF6A]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#D4AF6A]/10
                "
              />

            </div>


            {/* DESCRIPTION */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[1px]
                  text-[#475569]
                "
              >
                Course Description
              </label>

              <textarea
                rows={7}
                value={courseDescription}
                onChange={(e) =>
                  setCourseDescription(
                    e.target.value
                  )
                }
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[#D8D4CC]
                  bg-[#FAF9F6]
                  px-4
                  py-3.5
                  text-sm
                  font-medium
                  leading-6
                  text-[#0F172A]
                  outline-none
                  transition
                  focus:border-[#D4AF6A]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#D4AF6A]/10
                "
              />

            </div>


            {/* PRICE + DISCOUNT */}

            <div
              className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
              "
            >

              {/* PRICE */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[1px]
                    text-[#475569]
                  "
                >
                  Course Price
                </label>

                <div className="relative">

                  <span
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      font-black
                      text-[#8B672B]
                    "
                  >
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={coursePrice}
                    onChange={(e) =>
                      setCoursePrice(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#D8D4CC]
                      bg-[#FAF9F6]
                      py-3.5
                      pl-9
                      pr-4
                      text-sm
                      font-semibold
                      text-[#0F172A]
                      outline-none
                      transition
                      focus:border-[#D4AF6A]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#D4AF6A]/10
                    "
                  />

                </div>

              </div>


              {/* DISCOUNT */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[1px]
                    text-[#475569]
                  "
                >
                  Discount
                </label>

                <div className="relative">

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#D8D4CC]
                      bg-[#FAF9F6]
                      px-4
                      py-3.5
                      pr-10
                      text-sm
                      font-semibold
                      text-[#0F172A]
                      outline-none
                      transition
                      focus:border-[#D4AF6A]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#D4AF6A]/10
                    "
                  />

                  <span
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      font-black
                      text-[#8B672B]
                    "
                  >
                    %
                  </span>

                </div>

                <p
                  className="
                    mt-1.5
                    text-[8px]
                    text-[#94A3B8]
                  "
                >
                  Maximum discount allowed is 100%.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            THUMBNAIL
        ================================================= */}

        <section
          className="
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            sm:p-7
          "
        >

          <div className="mb-6">

            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[1.7px]
                text-[#B88A3B]
              "
            >
              Visual Identity
            </p>

            <h2
              className="
                mt-1.5
                text-xl
                font-black
                text-[#0F172A]
              "
            >
              Course thumbnail
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                text-[#94A3B8]
              "
            >
              Replace the current course cover
              whenever you need.
            </p>

          </div>


          <div
            className="
              grid
              gap-6
              lg:grid-cols-[280px_1fr]
              lg:items-center
            "
          >

            {/* CURRENT IMAGE */}

            <div>

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E7E5E0]
                  bg-[#FAF9F6]
                  shadow-sm
                "
              >

                {currentThumbnail ? (

                  <img
                    src={currentThumbnail}
                    alt="Course thumbnail"
                    className="
                      aspect-video
                      w-full
                      object-cover
                    "
                  />

                ) : (

                  <div
                    className="
                      flex
                      aspect-video
                      items-center
                      justify-center
                      bg-[#F5E8C8]
                    "
                  >

                    <span
                      className="
                        text-xs
                        font-black
                        text-[#8B672B]
                      "
                    >
                      No Thumbnail
                    </span>

                  </div>

                )}

                <div
                  className="
                    absolute
                    left-3
                    top-3
                    rounded-full
                    bg-[#0F172A]/85
                    px-2.5
                    py-1.5
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[1px]
                    text-white
                  "
                >
                  Current
                </div>

              </div>

            </div>


            {/* UPLOAD */}

            <div>

              <label
                className="
                  group
                  flex
                  min-h-[170px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-dashed
                  border-[#D8D4CC]
                  bg-[#FAF9F6]
                  px-6
                  text-center
                  transition
                  hover:border-[#D4AF6A]
                  hover:bg-[#FDFBF6]
                "
              >

                <span
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#F5E8C8]
                    text-[#8B672B]
                    transition
                    group-hover:scale-105
                  "
                >

                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                  >

                    <path
                      d="M12 16V4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                    <path
                      d="M7 9L12 4L17 9"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M5 20H19"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                  </svg>

                </span>


                <p
                  className="
                    mt-4
                    text-xs
                    font-black
                    text-[#0F172A]
                  "
                >
                  Choose a new thumbnail
                </p>


                <p
                  className="
                    mt-1.5
                    text-[9px]
                    text-[#94A3B8]
                  "
                >
                  JPG, PNG or WEBP
                </p>


                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbnail(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                  className="hidden"
                />

              </label>


              {thumbnail && (

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-emerald-100
                    bg-emerald-50
                    px-4
                    py-3
                  "
                >

                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-emerald-100
                      text-emerald-600
                    "
                  >

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <path
                        d="M5 12.5L9.5 17L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </span>


                  <div className="min-w-0">

                    <p
                      className="
                        text-[9px]
                        font-black
                        text-emerald-700
                      "
                    >
                      New thumbnail selected
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[8px]
                        text-emerald-600
                      "
                    >
                      {thumbnail.name}
                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>

        </section>


        {/* =================================================
            PUBLISH SETTINGS
        ================================================= */}

        <section
          className="
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            sm:p-7
          "
        >

          <div className="mb-6">

            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[1.7px]
                text-[#B88A3B]
              "
            >
              Visibility
            </p>

            <h2
              className="
                mt-1.5
                text-xl
                font-black
                text-[#0F172A]
              "
            >
              Publishing settings
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                text-[#94A3B8]
              "
            >
              Control whether students can see
              this course.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              setIsPublished(
                !isPublished
              )
            }
            className="
              flex
              w-full
              items-center
              justify-between
              gap-5
              rounded-2xl
              border
              border-[#E7E5E0]
              bg-[#FAF9F6]
              p-4
              text-left
              transition
              hover:border-[#D4AF6A]
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <span
                className={`
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    isPublished
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-[#F5E8C8] text-[#8B672B]"
                  }
                `}
              >

                {isPublished ? (

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >

                    <path
                      d="M5 12.5L9.5 17L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                  </svg>

                ) : (

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >

                    <path
                      d="M12 3L20 7.5V12C20 17 16.5 20 12 21C7.5 20 4 17 4 12V7.5L12 3Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M12 8V12"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                  </svg>

                )}

              </span>


              <div>

                <p
                  className="
                    text-xs
                    font-black
                    text-[#0F172A]
                  "
                >
                  {isPublished
                    ? "Course is published"
                    : "Course is currently a draft"}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    leading-4
                    text-[#94A3B8]
                  "
                >
                  {isPublished
                    ? "Students can discover and access this course."
                    : "Students cannot see this course until you publish it."}
                </p>

              </div>

            </div>


            {/* SWITCH */}

            <span
              className={`
                relative
                h-6
                w-11
                shrink-0
                rounded-full
                transition
                ${
                  isPublished
                    ? "bg-[#D4AF6A]"
                    : "bg-[#D6D3D1]"
                }
              `}
            >

              <span
                className={`
                  absolute
                  top-1
                  h-4
                  w-4
                  rounded-full
                  bg-white
                  shadow
                  transition
                  ${
                    isPublished
                      ? "left-6"
                      : "left-1"
                  }
                `}
              />

            </span>

          </button>

        </section>


        {/* =================================================
            ACTION BAR
        ================================================= */}

        <section
          className="
            sticky
            bottom-4
            z-10
            rounded-2xl
            border
            border-[#D8D4CC]
            bg-white/95
            p-4
            shadow-[0_15px_40px_rgba(15,23,42,0.10)]
            backdrop-blur
            sm:p-5
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-black
                  text-[#0F172A]
                "
              >
                Save your changes
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-[#94A3B8]
                "
              >
                Your existing course content will
                remain unchanged.
              </p>

            </div>


            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  navigate(
                    "/educator/my-courses"
                  )
                }
                className="
                  rounded-xl
                  border
                  border-[#D8D4CC]
                  bg-white
                  px-6
                  py-3
                  text-[10px]
                  font-black
                  text-[#475569]
                  transition
                  hover:border-[#0F172A]
                  hover:text-[#0F172A]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={saving}
                className="
                  flex
                  min-w-[155px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#0F172A]
                  px-6
                  py-3
                  text-[10px]
                  font-black
                  text-white
                  transition
                  hover:bg-[#1B263B]
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {saving ? (

                  <>
                    <span
                      className="
                        h-3.5
                        w-3.5
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-[#D4AF6A]
                      "
                    />

                    Saving...

                  </>

                ) : (

                  <>
                    Save Changes

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
                  </>

                )}

              </button>

            </div>

          </div>

        </section>

      </form>

    </div>
  );
};

export default EditCourse;