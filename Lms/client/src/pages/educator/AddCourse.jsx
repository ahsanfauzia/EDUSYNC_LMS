import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AddCourse = () => {
  const {
    backendUrl,
    getToken,
    navigate,
  } = useContext(AppContext);

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);

  const [chapters, setChapters] = useState([]);

  const [loading, setLoading] = useState(false);

  // =========================================================
  // ADD CHAPTER
  // =========================================================

  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        chapterId: `chapter-${Date.now()}-${prev.length}`,
        chapterOrder: prev.length + 1,
        chapterTitle: "",
        chapterContent: [],
      },
    ]);
  };

  // =========================================================
  // UPDATE CHAPTER
  // =========================================================

  const updateChapterTitle = (chapterIndex, value) => {
    setChapters((prev) =>
      prev.map((chapter, index) =>
        index === chapterIndex
          ? {
              ...chapter,
              chapterTitle: value,
            }
          : chapter
      )
    );
  };

  // =========================================================
  // DELETE CHAPTER
  // =========================================================

  const deleteChapter = (chapterIndex) => {
    setChapters((prev) =>
      prev
        .filter((_, index) => index !== chapterIndex)
        .map((chapter, index) => ({
          ...chapter,
          chapterOrder: index + 1,
        }))
    );
  };

  // =========================================================
  // ADD LECTURE
  // =========================================================

  const addLecture = (chapterIndex) => {
    setChapters((prev) =>
      prev.map((chapter, index) => {
        if (index !== chapterIndex) {
          return chapter;
        }

        return {
          ...chapter,
          chapterContent: [
            ...chapter.chapterContent,
            {
              lectureId: `lecture-${Date.now()}-${chapter.chapterContent.length}`,
              lectureTitle: "",
              lectureDuration: 0,
              lectureUrl: "",
              previewVideoId: "",
              isPreviewFree: false,
              lectureNotes: {
                title: "",
                url: "",
                publicId: "",
              },
              notesFile: null,
            },
          ],
        };
      })
    );
  };

  // =========================================================
  // UPDATE LECTURE
  // =========================================================

  const updateLecture = (
    chapterIndex,
    lectureIndex,
    field,
    value
  ) => {
    setChapters((prev) =>
      prev.map((chapter, cIndex) => {
        if (cIndex !== chapterIndex) {
          return chapter;
        }

        return {
          ...chapter,
          chapterContent: chapter.chapterContent.map(
            (lecture, lIndex) =>
              lIndex === lectureIndex
                ? {
                    ...lecture,
                    [field]: value,
                  }
                : lecture
          ),
        };
      })
    );
  };

  // =========================================================
  // DELETE LECTURE
  // =========================================================

  const deleteLecture = (
    chapterIndex,
    lectureIndex
  ) => {
    setChapters((prev) =>
      prev.map((chapter, cIndex) =>
        cIndex === chapterIndex
          ? {
              ...chapter,
              chapterContent:
                chapter.chapterContent.filter(
                  (_, index) =>
                    index !== lectureIndex
                ),
            }
          : chapter
      )
    );
  };

  // =========================================================
  // SELECT NOTES FILE
  // =========================================================

  const handleNotesFile = (
    chapterIndex,
    lectureIndex,
    file
  ) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      return;
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "PDF size must be less than 20MB."
      );
      return;
    }

    setChapters((prev) =>
      prev.map((chapter, cIndex) => {
        if (cIndex !== chapterIndex) {
          return chapter;
        }

        return {
          ...chapter,
          chapterContent:
            chapter.chapterContent.map(
              (lecture, lIndex) =>
                lIndex === lectureIndex
                  ? {
                      ...lecture,
                      notesFile: file,
                    }
                  : lecture
            ),
        };
      })
    );
  };

  // =========================================================
  // VALIDATE COURSE
  // =========================================================

  const validateCourse = () => {
    if (!courseTitle.trim()) {
      toast.error("Course title is required.");
      return false;
    }

    if (!courseDescription.trim()) {
      toast.error(
        "Course description is required."
      );
      return false;
    }

    if (
      coursePrice === "" ||
      Number(coursePrice) < 0
    ) {
      toast.error(
        "Please enter a valid course price."
      );
      return false;
    }

    if (!image) {
      toast.error(
        "Please upload a course thumbnail."
      );
      return false;
    }

    if (!chapters.length) {
      toast.error(
        "Please add at least one chapter."
      );
      return false;
    }

    for (
      let chapterIndex = 0;
      chapterIndex < chapters.length;
      chapterIndex++
    ) {
      const chapter = chapters[chapterIndex];

      if (!chapter.chapterTitle.trim()) {
        toast.error(
          `Please enter a title for Chapter ${
            chapterIndex + 1
          }.`
        );
        return false;
      }

      if (!chapter.chapterContent.length) {
        toast.error(
          `Please add at least one lecture to Chapter ${
            chapterIndex + 1
          }.`
        );
        return false;
      }

      for (
        let lectureIndex = 0;
        lectureIndex <
        chapter.chapterContent.length;
        lectureIndex++
      ) {
        const lecture =
          chapter.chapterContent[
            lectureIndex
          ];

        if (!lecture.lectureTitle.trim()) {
          toast.error(
            `Please enter a title for Lecture ${
              lectureIndex + 1
            }.`
          );
          return false;
        }
      }
    }

    return true;
  };

  // =========================================================
  // SUBMIT COURSE
  // =========================================================

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!validateCourse()) {
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        toast.error(
          "Please sign in before creating a course."
        );
        return;
      }

      // Remove local File objects before sending JSON.
      const cleanCourseContent = chapters.map(
        (chapter) => ({
          chapterId: chapter.chapterId,
          chapterOrder: chapter.chapterOrder,
          chapterTitle: chapter.chapterTitle.trim(),

          chapterContent:
            chapter.chapterContent.map(
              (lecture) => ({
                lectureId: lecture.lectureId,
                lectureTitle:
                  lecture.lectureTitle.trim(),
                lectureDuration:
                  Number(
                    lecture.lectureDuration
                  ) || 0,
                lectureUrl:
                  lecture.lectureUrl?.trim() ||
                  "",
                previewVideoId:
                  lecture.previewVideoId?.trim() ||
                  "",
                isPreviewFree:
                  Boolean(
                    lecture.isPreviewFree
                  ),
                lectureNotes: {
                  title:
                    lecture.lectureNotes
                      ?.title || "",
                  url:
                    lecture.lectureNotes
                      ?.url || "",
                  publicId:
                    lecture.lectureNotes
                      ?.publicId || "",
                },
              })
            ),
        })
      );

      const courseData = {
        courseTitle: courseTitle.trim(),
        courseDescription:
          courseDescription.trim(),
        coursePrice: Number(coursePrice),
        discount:
          Math.min(
            100,
            Math.max(
              0,
              Number(discount) || 0
            )
          ),
        courseContent:
          cleanCourseContent,
      };

      // =====================================================
      // CREATE COURSE
      // =====================================================

      const formData = new FormData();

      formData.append(
        "courseData",
        JSON.stringify(courseData)
      );

      formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success) {
        toast.error(
          data.message ||
            "Unable to create course."
        );
        return;
      }

      const createdCourse = data.course;

      // =====================================================
      // UPLOAD PDF NOTES
      // =====================================================

      for (
        let chapterIndex = 0;
        chapterIndex < chapters.length;
        chapterIndex++
      ) {
        const chapter =
          chapters[chapterIndex];

        for (
          let lectureIndex = 0;
          lectureIndex <
          chapter.chapterContent.length;
          lectureIndex++
        ) {
          const lecture =
            chapter.chapterContent[
              lectureIndex
            ];

          if (!lecture.notesFile) {
            continue;
          }

          const createdChapter =
            createdCourse.courseContent?.[
              chapterIndex
            ];

          const createdLecture =
            createdChapter?.chapterContent?.[
              lectureIndex
            ];

          if (
            !createdChapter ||
            !createdLecture
          ) {
            continue;
          }

          const notesFormData =
            new FormData();

          notesFormData.append(
            "notes",
            lecture.notesFile
          );

          await axios.post(
            `${backendUrl}/api/educator/course/${createdCourse._id}/chapter/${createdChapter.chapterId}/lecture/${createdLecture.lectureId}/notes`,
            notesFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }

      toast.success(
        "Course created successfully!"
      );

      navigate("/educator/my-courses");

    } catch (error) {
      console.error(
        "Create Course Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to create course."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-7">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

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
              navigate("/educator/dashboard")
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

            Back to Dashboard

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
              Course Builder
            </span>

          </div>


          <h1
            className="
              mt-4
              text-2xl
              font-black
              tracking-[-0.7px]
              text-white
              sm:text-3xl
            "
          >
            Create a new course
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
            Build a structured learning experience
            with chapters, lectures, video content,
            and downloadable notes.
          </p>

        </div>

      </section>


      {/* ===================================================== */}
      {/* FORM */}
      {/* ===================================================== */}

      <form
        onSubmit={onSubmit}
        className="space-y-6"
      >

        {/* =================================================== */}
        {/* BASIC INFORMATION */}
        {/* =================================================== */}

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
              Step 01
            </p>

            <h2
              className="
                mt-1.5
                text-xl
                font-black
                text-[#0F172A]
              "
            >
              Course information
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                text-[#94A3B8]
              "
            >
              Add the core details students will
              see before enrolling.
            </p>

          </div>


          <div className="grid gap-5 lg:grid-cols-2">

            {/* Course title */}

            <div className="lg:col-span-2">

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
                  setCourseTitle(e.target.value)
                }
                placeholder="e.g. Complete UI/UX Design Masterclass"
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D8D4CC]
                  bg-[#FAF9F6]
                  px-4
                  py-3.5
                  text-sm
                  font-medium
                  text-[#0F172A]
                  outline-none
                  transition
                  placeholder:text-[#A8A29E]
                  focus:border-[#D4AF6A]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#D4AF6A]/10
                "
              />

            </div>


            {/* Description */}

            <div className="lg:col-span-2">

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
                value={courseDescription}
                onChange={(e) =>
                  setCourseDescription(
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Describe what students will learn, who the course is for, and what they can expect..."
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
                  placeholder:text-[#A8A29E]
                  focus:border-[#D4AF6A]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#D4AF6A]/10
                "
              />

            </div>


            {/* Price */}

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
                  placeholder="999"
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
                    placeholder:text-[#A8A29E]
                    focus:border-[#D4AF6A]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#D4AF6A]/10
                  "
                />

              </div>

            </div>


            {/* Discount */}

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
                  placeholder="20"
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
                    placeholder:text-[#A8A29E]
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

            </div>


            {/* Thumbnail */}

            <div className="lg:col-span-2">

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
                Course Thumbnail
              </label>


              <label
                className="
                  group
                  flex
                  min-h-[190px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border
                  border-dashed
                  border-[#CFC9BF]
                  bg-[#FAF9F6]
                  transition
                  hover:border-[#D4AF6A]
                  hover:bg-[#FDFBF6]
                "
              >

                {image ? (

                  <div className="relative h-full w-full">

                    <img
                      src={URL.createObjectURL(
                        image
                      )}
                      alt="Course thumbnail preview"
                      className="
                        h-[190px]
                        w-full
                        object-cover
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        bg-[#0F172A]/50
                        opacity-0
                        transition
                        group-hover:opacity-100
                      "
                    >

                      <span
                        className="
                          rounded-lg
                          bg-white
                          px-4
                          py-2
                          text-[10px]
                          font-black
                          text-[#0F172A]
                        "
                      >
                        Change Thumbnail
                      </span>

                    </div>

                  </div>

                ) : (

                  <>

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
                      "
                    >

                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 24 24"
                        fill="none"
                      >

                        <path
                          d="M4 17.5V6.5C4 5.67 4.67 5 5.5 5H18.5C19.33 5 20 5.67 20 6.5V17.5C20 18.33 19.33 19 18.5 19H5.5C4.67 19 4 18.33 4 17.5Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />

                        <circle
                          cx="8.5"
                          cy="9"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />

                        <path
                          d="M5 17L10 12L13 15L15 13L19 17"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
                      Upload course thumbnail
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-[9px]
                        text-[#94A3B8]
                      "
                    >
                      JPG, PNG or WEBP recommended
                    </p>

                  </>

                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setImage(
                      e.target.files?.[0] || null
                    )
                  }
                />

              </label>

            </div>

          </div>

        </section>


        {/* =================================================== */}
        {/* COURSE CONTENT */}
        {/* =================================================== */}

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

          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >

            <div>

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[1.7px]
                  text-[#B88A3B]
                "
              >
                Step 02
              </p>

              <h2
                className="
                  mt-1.5
                  text-xl
                  font-black
                  text-[#0F172A]
                "
              >
                Course curriculum
              </h2>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#94A3B8]
                "
              >
                Organize your course into chapters
                and lectures.
              </p>

            </div>


            <button
              type="button"
              onClick={addChapter}
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-xl
                bg-[#0F172A]
                px-4
                py-3
                text-[10px]
                font-black
                text-white
                transition
                hover:bg-[#1B263B]
                active:scale-[0.98]
              "
            >

              <span className="text-base leading-none text-[#D4AF6A]">
                +
              </span>

              Add Chapter

            </button>

          </div>


          {/* Chapters */}

          {chapters.length > 0 ? (

            <div className="mt-7 space-y-5">

              {chapters.map(
                (chapter, chapterIndex) => (

                  <div
                    key={chapter.chapterId}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#E7E5E0]
                      bg-[#FAF9F6]
                    "
                  >

                    {/* Chapter Header */}

                    <div
                      className="
                        border-b
                        border-[#E7E5E0]
                        bg-white
                        p-4
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
                        "
                      >

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#0F172A]
                            text-xs
                            font-black
                            text-[#D4AF6A]
                          "
                        >
                          {String(
                            chapterIndex + 1
                          ).padStart(2, "0")}
                        </div>


                        <div className="min-w-0 flex-1">

                          <label
                            className="
                              mb-1.5
                              block
                              text-[8px]
                              font-black
                              uppercase
                              tracking-[1px]
                              text-[#94A3B8]
                            "
                          >
                            Chapter Title
                          </label>

                          <input
                            type="text"
                            value={
                              chapter.chapterTitle
                            }
                            onChange={(e) =>
                              updateChapterTitle(
                                chapterIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Chapter ${
                              chapterIndex + 1
                            }`}
                            className="
                              w-full
                              rounded-lg
                              border
                              border-[#E7E5E0]
                              bg-[#FAF9F6]
                              px-3
                              py-2.5
                              text-xs
                              font-bold
                              text-[#0F172A]
                              outline-none
                              transition
                              focus:border-[#D4AF6A]
                              focus:bg-white
                            "
                          />

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            deleteChapter(
                              chapterIndex
                            )
                          }
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-[#E7E5E0]
                            text-[#94A3B8]
                            transition
                            hover:border-red-200
                            hover:bg-red-50
                            hover:text-red-500
                          "
                          title="Delete chapter"
                        >

                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 7H19"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />

                            <path
                              d="M10 11V17"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />

                            <path
                              d="M14 11V17"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />

                            <path
                              d="M7 7L8 19H16L17 7"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinejoin="round"
                            />

                            <path
                              d="M9 7L10 4H14L15 7"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinejoin="round"
                            />
                          </svg>

                        </button>

                      </div>

                    </div>


                    {/* Lectures */}

                    <div className="p-4 sm:p-5">

                      {chapter.chapterContent
                        .length > 0 ? (

                        <div className="space-y-4">

                          {chapter.chapterContent.map(
                            (
                              lecture,
                              lectureIndex
                            ) => (

                              <div
                                key={
                                  lecture.lectureId
                                }
                                className="
                                  rounded-xl
                                  border
                                  border-[#E7E5E0]
                                  bg-white
                                  p-4
                                "
                              >

                                <div
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                  "
                                >

                                  <div
                                    className="
                                      flex
                                      items-center
                                      gap-2.5
                                    "
                                  >

                                    <span
                                      className="
                                        flex
                                        h-7
                                        w-7
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[#F5E8C8]
                                        text-[9px]
                                        font-black
                                        text-[#8B672B]
                                      "
                                    >
                                      {lectureIndex +
                                        1}
                                    </span>

                                    <span
                                      className="
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[1px]
                                        text-[#94A3B8]
                                      "
                                    >
                                      Lecture
                                    </span>

                                  </div>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteLecture(
                                        chapterIndex,
                                        lectureIndex
                                      )
                                    }
                                    className="
                                      flex
                                      h-8
                                      w-8
                                      items-center
                                      justify-center
                                      rounded-lg
                                      text-[#94A3B8]
                                      transition
                                      hover:bg-red-50
                                      hover:text-red-500
                                    "
                                    title="Delete lecture"
                                  >

                                    <svg
                                      width="15"
                                      height="15"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        d="M5 7H19"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                      />

                                      <path
                                        d="M10 11V17"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                      />

                                      <path
                                        d="M14 11V17"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                      />

                                      <path
                                        d="M7 7L8 19H16L17 7"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinejoin="round"
                                      />
                                    </svg>

                                  </button>

                                </div>


                                <div className="mt-4 grid gap-4 lg:grid-cols-2">

                                  {/* Lecture title */}

                                  <div className="lg:col-span-2">

                                    <label
                                      className="
                                        mb-1.5
                                        block
                                        text-[8px]
                                        font-black
                                        uppercase
                                        tracking-[1px]
                                        text-[#64748B]
                                      "
                                    >
                                      Lecture Title
                                    </label>

                                    <input
                                      type="text"
                                      value={
                                        lecture.lectureTitle
                                      }
                                      onChange={(e) =>
                                        updateLecture(
                                          chapterIndex,
                                          lectureIndex,
                                          "lectureTitle",
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g. Introduction to UI Design"
                                      className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#E7E5E0]
                                        bg-[#FAF9F6]
                                        px-3
                                        py-2.5
                                        text-xs
                                        font-semibold
                                        text-[#0F172A]
                                        outline-none
                                        transition
                                        focus:border-[#D4AF6A]
                                        focus:bg-white
                                      "
                                    />

                                  </div>


                                  {/* Video URL */}

                                  <div className="lg:col-span-2">

                                    <label
                                      className="
                                        mb-1.5
                                        block
                                        text-[8px]
                                        font-black
                                        uppercase
                                        tracking-[1px]
                                        text-[#64748B]
                                      "
                                    >
                                      Video URL
                                    </label>

                                    <input
                                      type="text"
                                      value={
                                        lecture.lectureUrl
                                      }
                                      onChange={(e) =>
                                        updateLecture(
                                          chapterIndex,
                                          lectureIndex,
                                          "lectureUrl",
                                          e.target.value
                                        )
                                      }
                                      placeholder="https://www.youtube.com/watch?v=..."
                                      className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#E7E5E0]
                                        bg-[#FAF9F6]
                                        px-3
                                        py-2.5
                                        text-xs
                                        font-medium
                                        text-[#0F172A]
                                        outline-none
                                        transition
                                        focus:border-[#D4AF6A]
                                        focus:bg-white
                                      "
                                    />

                                    <p
                                      className="
                                        mt-1.5
                                        text-[8px]
                                        text-[#A8A29E]
                                      "
                                    >
                                      YouTube URL or direct video URL.
                                    </p>

                                  </div>


                                  {/* Preview Video ID */}

                                  <div>

                                    <label
                                      className="
                                        mb-1.5
                                        block
                                        text-[8px]
                                        font-black
                                        uppercase
                                        tracking-[1px]
                                        text-[#64748B]
                                      "
                                    >
                                      Preview Video ID
                                    </label>

                                    <input
                                      type="text"
                                      value={
                                        lecture.previewVideoId
                                      }
                                      onChange={(e) =>
                                        updateLecture(
                                          chapterIndex,
                                          lectureIndex,
                                          "previewVideoId",
                                          e.target.value
                                        )
                                      }
                                      placeholder="YouTube video ID"
                                      className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#E7E5E0]
                                        bg-[#FAF9F6]
                                        px-3
                                        py-2.5
                                        text-xs
                                        font-medium
                                        text-[#0F172A]
                                        outline-none
                                        transition
                                        focus:border-[#D4AF6A]
                                        focus:bg-white
                                      "
                                    />

                                  </div>


                                  {/* Duration */}

                                  <div>

                                    <label
                                      className="
                                        mb-1.5
                                        block
                                        text-[8px]
                                        font-black
                                        uppercase
                                        tracking-[1px]
                                        text-[#64748B]
                                      "
                                    >
                                      Duration
                                    </label>

                                    <div className="relative">

                                      <input
                                        type="number"
                                        min="0"
                                        value={
                                          lecture.lectureDuration
                                        }
                                        onChange={(e) =>
                                          updateLecture(
                                            chapterIndex,
                                            lectureIndex,
                                            "lectureDuration",
                                            e.target.value
                                          )
                                        }
                                        placeholder="10"
                                        className="
                                          w-full
                                          rounded-lg
                                          border
                                          border-[#E7E5E0]
                                          bg-[#FAF9F6]
                                          px-3
                                          py-2.5
                                          pr-14
                                          text-xs
                                          font-medium
                                          text-[#0F172A]
                                          outline-none
                                          transition
                                          focus:border-[#D4AF6A]
                                          focus:bg-white
                                        "
                                      />

                                      <span
                                        className="
                                          absolute
                                          right-3
                                          top-1/2
                                          -translate-y-1/2
                                          text-[9px]
                                          font-bold
                                          text-[#94A3B8]
                                        "
                                      >
                                        min
                                      </span>

                                    </div>

                                  </div>


                                  {/* Free Preview */}

                                  <div
                                    className="
                                      flex
                                      items-center
                                      justify-between
                                      rounded-xl
                                      border
                                      border-[#E7E5E0]
                                      bg-[#FAF9F6]
                                      px-4
                                      py-3
                                      lg:col-span-2
                                    "
                                  >

                                    <div>

                                      <p
                                        className="
                                          text-[10px]
                                          font-black
                                          text-[#0F172A]
                                        "
                                      >
                                        Free Preview
                                      </p>

                                      <p
                                        className="
                                          mt-0.5
                                          text-[8px]
                                          text-[#94A3B8]
                                        "
                                      >
                                        Allow students to watch
                                        this lecture before
                                        enrolling.
                                      </p>

                                    </div>


                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateLecture(
                                          chapterIndex,
                                          lectureIndex,
                                          "isPreviewFree",
                                          !lecture.isPreviewFree
                                        )
                                      }
                                      className={`
                                        relative
                                        h-6
                                        w-11
                                        rounded-full
                                        transition
                                        ${
                                          lecture.isPreviewFree
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
                                            lecture.isPreviewFree
                                              ? "left-6"
                                              : "left-1"
                                          }
                                        `}
                                      />

                                    </button>

                                  </div>


                                  {/* PDF Notes */}

                                  <div
                                    className="
                                      rounded-xl
                                      border
                                      border-dashed
                                      border-[#D8D4CC]
                                      bg-[#FAF9F6]
                                      p-4
                                      lg:col-span-2
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
                                            text-[10px]
                                            font-black
                                            text-[#0F172A]
                                          "
                                        >
                                          Lecture Notes
                                        </p>

                                        <p
                                          className="
                                            mt-1
                                            text-[8px]
                                            text-[#94A3B8]
                                          "
                                        >
                                          Upload an optional PDF
                                          for this lecture.
                                        </p>

                                      </div>


                                      <label
                                        className="
                                          flex
                                          w-fit
                                          cursor-pointer
                                          items-center
                                          gap-2
                                          rounded-lg
                                          border
                                          border-[#D8D4CC]
                                          bg-white
                                          px-3
                                          py-2.5
                                          text-[9px]
                                          font-black
                                          text-[#475569]
                                          transition
                                          hover:border-[#D4AF6A]
                                          hover:text-[#8B672B]
                                        "
                                      >

                                        <svg
                                          width="15"
                                          height="15"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                        >
                                          <path
                                            d="M7 3H14L19 8V20C19 20.55 18.55 21 18 21H7C6.45 21 6 20.55 6 20V4C6 3.45 6.45 3 7 3Z"
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

                                          <path
                                            d="M9 13H16"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                          />

                                          <path
                                            d="M9 16H14"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                          />
                                        </svg>

                                        {lecture.notesFile
                                          ? "Change PDF"
                                          : "Choose PDF"}

                                        <input
                                          type="file"
                                          accept="application/pdf"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleNotesFile(
                                              chapterIndex,
                                              lectureIndex,
                                              e.target.files?.[0]
                                            )
                                          }
                                        />

                                      </label>

                                    </div>


                                    {lecture.notesFile && (

                                      <div
                                        className="
                                          mt-3
                                          flex
                                          items-center
                                          gap-3
                                          rounded-lg
                                          bg-white
                                          px-3
                                          py-2.5
                                        "
                                      >

                                        <span
                                          className="
                                            flex
                                            h-7
                                            w-7
                                            items-center
                                            justify-center
                                            rounded-md
                                            bg-red-50
                                            text-[9px]
                                            font-black
                                            text-red-500
                                          "
                                        >
                                          PDF
                                        </span>

                                        <span
                                          className="
                                            min-w-0
                                            flex-1
                                            truncate
                                            text-[9px]
                                            font-semibold
                                            text-[#475569]
                                          "
                                        >
                                          {
                                            lecture.notesFile
                                              .name
                                          }
                                        </span>

                                      </div>

                                    )}

                                  </div>

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      ) : (

                        <div
                          className="
                            rounded-xl
                            border
                            border-dashed
                            border-[#D8D4CC]
                            bg-white
                            px-5
                            py-10
                            text-center
                          "
                        >

                          <div
                            className="
                              mx-auto
                              flex
                              h-12
                              w-12
                              items-center
                              justify-center
                              rounded-xl
                              bg-[#F5E8C8]
                              text-[#8B672B]
                            "
                          >
                            +
                          </div>

                          <p
                            className="
                              mt-4
                              text-xs
                              font-black
                              text-[#0F172A]
                            "
                          >
                            No lectures yet
                          </p>

                          <p
                            className="
                              mt-1
                              text-[9px]
                              text-[#94A3B8]
                            "
                          >
                            Add the first lecture to this
                            chapter.
                          </p>

                        </div>

                      )}


                      {/* Add Lecture */}

                      <button
                        type="button"
                        onClick={() =>
                          addLecture(chapterIndex)
                        }
                        className="
                          mt-4
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-dashed
                          border-[#D4AF6A]
                          bg-[#FDFBF6]
                          py-3
                          text-[10px]
                          font-black
                          text-[#8B672B]
                          transition
                          hover:bg-[#F5E8C8]/50
                        "
                      >

                        <span className="text-base">
                          +
                        </span>

                        Add Lecture

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div
              className="
                mt-7
                rounded-2xl
                border
                border-dashed
                border-[#D8D4CC]
                bg-[#FAF9F6]
                px-6
                py-16
                text-center
              "
            >

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
                    d="M8 12H14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                </svg>

              </div>


              <h3
                className="
                  mt-5
                  text-base
                  font-black
                  text-[#0F172A]
                "
              >
                Start building your curriculum
              </h3>


              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-[10px]
                  leading-5
                  text-[#94A3B8]
                "
              >
                Add chapters first, then populate
                each chapter with video lectures and
                optional PDF notes.
              </p>


              <button
                type="button"
                onClick={addChapter}
                className="
                  mt-5
                  rounded-xl
                  bg-[#0F172A]
                  px-5
                  py-3
                  text-[10px]
                  font-black
                  text-white
                  transition
                  hover:bg-[#1B263B]
                "
              >
                Add First Chapter
              </button>

            </div>

          )}

        </section>


        {/* =================================================== */}
        {/* PUBLISH BAR */}
        {/* =================================================== */}

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
                Ready to publish?
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-[#94A3B8]
                "
              >
                Your course will be published after
                successful submission.
              </p>

            </div>


            <div className="flex gap-3">

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  navigate("/educator/dashboard")
                }
                className="
                  rounded-xl
                  border
                  border-[#D8D4CC]
                  bg-white
                  px-5
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
                disabled={loading}
                className="
                  flex
                  min-w-[155px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#0F172A]
                  px-5
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

                {loading ? (

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

                    Publishing...

                  </>

                ) : (

                  <>
                    Publish Course

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

export default AddCourse;