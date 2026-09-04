import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";

const StudentsEnrolled = () => {
  const {
    backendUrl,
    getToken,
  } = useContext(AppContext);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH ENROLLED STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        toast.error("Please login again.");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/educator/enrolled-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success) {
        toast.error(
          data.message ||
            "Unable to load students."
        );

        return;
      }

      setStudents(data.students || []);
    } catch (error) {
      console.error(
        "StudentsEnrolled Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = useMemo(() => {
    const totalRevenue = students.reduce(
      (sum, student) =>
        sum + Number(student.amount || 0),
      0
    );

    const uniqueCourses = new Set(
      students
        .map(
          (student) =>
            student.courseTitle
        )
        .filter(Boolean)
    ).size;

    const uniqueStudents = new Set(
      students
        .map(
          (student) =>
            student.email ||
            student.studentName
        )
        .filter(Boolean)
    ).size;

    return {
      totalEnrollments:
        students.length,
      totalRevenue,
      uniqueCourses,
      uniqueStudents,
    };
  }, [students]);

  // =====================================================
  // FORMATTERS
  // =====================================================

  const formatMoney = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name = "") => {
    const words = name
      .trim()
      .split(" ")
      .filter(Boolean);

    if (!words.length) return "U";

    return words
      .slice(0, 2)
      .map((word) =>
        word.charAt(0).toUpperCase()
      )
      .join("");
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
                Learner Management
              </span>
            </div>

            <h1
              className="
                mt-4
                text-2xl
                font-black
                tracking-tight
                text-white
                sm:text-3xl
              "
            >
              Enrolled Students
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-[#CBD5E1]
              "
            >
              Loading your learner data...
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
              Loading students...
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

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-120px]
            left-[30%]
            h-60
            w-60
            rounded-full
            bg-[#D4AF6A]/5
            blur-3xl
          "
        />

        <div className="relative">

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
              Learner Management
            </span>

          </div>


          <div
            className="
              mt-4
              flex
              flex-col
              gap-5
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
                Enrolled Students
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
                View and monitor the learners
                enrolled in your courses.
              </p>

            </div>


            <div
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-[#D4AF6A]/20
                bg-[#D4AF6A]/10
                px-3
                py-2
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#D4AF6A]
                "
              />

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[1px]
                  text-[#D4AF6A]
                "
              >
                {students.length}{" "}
                {students.length === 1
                  ? "Enrollment"
                  : "Enrollments"}
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <section
        className="
          mt-6
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* TOTAL ENROLLMENTS */}

        <div
          className="
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            transition
            hover:-translate-y-0.5
            hover:border-[#D4AF6A]/50
            hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[1.5px]
                  text-[#94A3B8]
                "
              >
                Total Enrollments
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-[#0F172A]
                "
              >
                {summary.totalEnrollments}
              </p>

            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#F5E8C8]
                text-[#8B672B]
              "
            >

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
              >

                <circle
                  cx="9"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M3.5 20C3.5 16.96 5.96 14.5 9 14.5C12.04 14.5 14.5 16.96 14.5 20"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="M15 7C16.66 7 18 8.34 18 10C18 11.66 16.66 13 15 13"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="M16 15C18.76 15 21 17.24 21 20"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

              </svg>

            </div>

          </div>

        </div>


        {/* UNIQUE STUDENTS */}

        <div
          className="
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            transition
            hover:-translate-y-0.5
            hover:border-[#D4AF6A]/50
            hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[1.5px]
                  text-[#94A3B8]
                "
              >
                Unique Learners
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-[#0F172A]
                "
              >
                {summary.uniqueStudents}
              </p>

            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#0F172A]
                text-[#D4AF6A]
              "
            >

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
              >

                <circle
                  cx="12"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M5 20C5 16.69 8.13 14 12 14C15.87 14 19 16.69 19 20"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

              </svg>

            </div>

          </div>

        </div>


        {/* COURSES */}

        <div
          className="
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            transition
            hover:-translate-y-0.5
            hover:border-[#D4AF6A]/50
            hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[1.5px]
                  text-[#94A3B8]
                "
              >
                Active Courses
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-[#0F172A]
                "
              >
                {summary.uniqueCourses}
              </p>

            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#F5E8C8]
                text-[#8B672B]
              "
            >

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
              >

                <path
                  d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V18.5C20 19.33 19.33 20 18.5 20H5.5C4.67 20 4 19.33 4 18.5V5.5Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M8 9H16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="M8 13H13"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

              </svg>

            </div>

          </div>

        </div>


        {/* REVENUE */}

        <div
          className="
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            transition
            hover:-translate-y-0.5
            hover:border-[#D4AF6A]/50
            hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[1.5px]
                  text-[#94A3B8]
                "
              >
                Enrollment Revenue
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-[#0F172A]
                "
              >
                ₹
                {summary.totalRevenue.toLocaleString(
                  "en-IN"
                )}
              </p>

            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#0F172A]
                text-[#D4AF6A]
              "
            >

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
              >

                <path
                  d="M12 3V21"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="M16 7.5C16 6.12 14.21 5 12 5C9.79 5 8 6.12 8 7.5C8 8.88 9.79 10 12 10C14.21 10 16 11.12 16 12.5C16 13.88 14.21 15 12 15C9.79 15 8 13.88 8 12.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="M8 18C9.05 18.63 10.43 19 12 19C14.21 19 16 17.88 16 16.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

              </svg>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          STUDENTS TABLE
      ================================================= */}

      <section
        className="
          mt-6
          overflow-hidden
          rounded-2xl
          border
          border-[#E7E5E0]
          bg-white
        "
      >

        {/* SECTION HEADER */}

        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-[#E7E5E0]
            px-5
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
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
              Learner Directory
            </p>

            <h2
              className="
                mt-1.5
                text-lg
                font-black
                text-[#0F172A]
              "
            >
              Recent enrollments
            </h2>

          </div>


          {students.length > 0 && (

            <div
              className="
                flex
                items-center
                gap-2
                text-[9px]
                font-bold
                text-[#64748B]
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-500
                "
              />

              {students.length} records

            </div>

          )}

        </div>


        {/* EMPTY STATE */}

        {students.length === 0 ? (

          <div
            className="
              flex
              min-h-[340px]
              flex-col
              items-center
              justify-center
              px-6
              py-12
              text-center
            "
          >

            <div
              className="
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
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
              >

                <circle
                  cx="9"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M3.5 20C3.5 16.96 5.96 14.5 9 14.5C12.04 14.5 14.5 16.96 14.5 20"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="M16 8H21"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="M18.5 5.5V10.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

              </svg>

            </div>


            <h2
              className="
                mt-5
                text-sm
                font-black
                text-[#0F172A]
              "
            >
              No students enrolled yet
            </h2>


            <p
              className="
                mt-2
                max-w-sm
                text-[10px]
                leading-5
                text-[#94A3B8]
              "
            >
              Students will appear here after
              enrolling in one of your courses.
            </p>

          </div>

        ) : (

          <>
            {/* DESKTOP TABLE */}

            <div className="hidden overflow-x-auto lg:block">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr
                    className="
                      border-b
                      border-[#E7E5E0]
                      bg-[#FAF9F6]
                    "
                  >

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[1px]
                        text-[#64748B]
                      "
                    >
                      Student
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[1px]
                        text-[#64748B]
                      "
                    >
                      Email
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[1px]
                        text-[#64748B]
                      "
                    >
                      Course
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[1px]
                        text-[#64748B]
                      "
                    >
                      Amount
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[1px]
                        text-[#64748B]
                      "
                    >
                      Enrolled On
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {students.map(
                    (student, index) => {

                      const enrolledDate =
                        formatDate(
                          student.createdAt
                        );

                      return (
                        <tr
                          key={
                            student._id ||
                            index
                          }
                          className="
                            border-b
                            border-[#F0EEE9]
                            transition
                            last:border-0
                            hover:bg-[#FAF9F6]
                          "
                        >

                          {/* STUDENT */}

                          <td className="px-6 py-5">

                            <div
                              className="
                                flex
                                min-w-[190px]
                                items-center
                                gap-3
                              "
                            >

                              {student.imageUrl ? (

                                <img
                                  src={
                                    student.imageUrl
                                  }
                                  alt={
                                    student.studentName
                                  }
                                  className="
                                    h-10
                                    w-10
                                    shrink-0
                                    rounded-full
                                    object-cover
                                    ring-2
                                    ring-[#F5E8C8]
                                  "
                                />

                              ) : (

                                <div
                                  className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#0F172A]
                                    text-[10px]
                                    font-black
                                    text-[#D4AF6A]
                                  "
                                >
                                  {getInitials(
                                    student.studentName
                                  )}
                                </div>

                              )}


                              <div className="min-w-0">

                                <p
                                  className="
                                    truncate
                                    text-xs
                                    font-black
                                    text-[#0F172A]
                                  "
                                >
                                  {
                                    student.studentName ||
                                    "Unknown Student"
                                  }
                                </p>

                                <span
                                  className="
                                    mt-1
                                    inline-flex
                                    rounded-full
                                    bg-[#F5E8C8]
                                    px-2
                                    py-1
                                    text-[7px]
                                    font-black
                                    uppercase
                                    tracking-[0.7px]
                                    text-[#8B672B]
                                  "
                                >
                                  Learner
                                </span>

                              </div>

                            </div>

                          </td>


                          {/* EMAIL */}

                          <td className="px-6 py-5">

                            <span
                              className="
                                text-[10px]
                                font-medium
                                text-[#64748B]
                              "
                            >
                              {student.email || "-"}
                            </span>

                          </td>


                          {/* COURSE */}

                          <td className="px-6 py-5">

                            <p
                              className="
                                max-w-[220px]
                                text-[10px]
                                font-bold
                                leading-5
                                text-[#475569]
                              "
                            >
                              {
                                student.courseTitle ||
                                "-"
                              }
                            </p>

                          </td>


                          {/* AMOUNT */}

                          <td className="px-6 py-5">

                            <span
                              className="
                                text-xs
                                font-black
                                text-[#0F172A]
                              "
                            >
                              {formatMoney(
                                student.amount
                              )}
                            </span>

                          </td>


                          {/* DATE */}

                          <td className="px-6 py-5">

                            <span
                              className="
                                text-[10px]
                                font-bold
                                text-[#64748B]
                              "
                            >
                              {enrolledDate}
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>


            {/* MOBILE / TABLET CARDS */}

            <div
              className="
                divide-y
                divide-[#E7E5E0]
                lg:hidden
              "
            >

              {students.map(
                (student, index) => {

                  return (
                    <article
                      key={
                        student._id ||
                        index
                      }
                      className="
                        p-5
                        transition
                        hover:bg-[#FAF9F6]
                      "
                    >

                      {/* STUDENT TOP */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
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

                          {student.imageUrl ? (

                            <img
                              src={
                                student.imageUrl
                              }
                              alt={
                                student.studentName
                              }
                              className="
                                h-11
                                w-11
                                shrink-0
                                rounded-full
                                object-cover
                                ring-2
                                ring-[#F5E8C8]
                              "
                            />

                          ) : (

                            <div
                              className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#0F172A]
                                text-[10px]
                                font-black
                                text-[#D4AF6A]
                              "
                            >
                              {getInitials(
                                student.studentName
                              )}
                            </div>

                          )}


                          <div className="min-w-0">

                            <p
                              className="
                                truncate
                                text-xs
                                font-black
                                text-[#0F172A]
                              "
                            >
                              {
                                student.studentName ||
                                "Unknown Student"
                              }
                            </p>

                            <p
                              className="
                                mt-1
                                truncate
                                text-[9px]
                                text-[#94A3B8]
                              "
                            >
                              {
                                student.email ||
                                "-"
                              }
                            </p>

                          </div>

                        </div>


                        <span
                          className="
                            shrink-0
                            rounded-full
                            bg-[#F5E8C8]
                            px-2
                            py-1
                            text-[7px]
                            font-black
                            uppercase
                            tracking-[0.7px]
                            text-[#8B672B]
                          "
                        >
                          Learner
                        </span>

                      </div>


                      {/* COURSE */}

                      <div
                        className="
                          mt-5
                          rounded-xl
                          border
                          border-[#E7E5E0]
                          bg-[#FAF9F6]
                          p-4
                        "
                      >

                        <p
                          className="
                            text-[7px]
                            font-black
                            uppercase
                            tracking-[1px]
                            text-[#94A3B8]
                          "
                        >
                          Enrolled Course
                        </p>

                        <p
                          className="
                            mt-1.5
                            text-xs
                            font-black
                            leading-5
                            text-[#0F172A]
                          "
                        >
                          {
                            student.courseTitle ||
                            "-"
                          }
                        </p>

                      </div>


                      {/* DETAILS */}

                      <div
                        className="
                          mt-4
                          grid
                          grid-cols-2
                          gap-3
                        "
                      >

                        <div
                          className="
                            rounded-xl
                            border
                            border-[#E7E5E0]
                            bg-white
                            p-3
                          "
                        >

                          <p
                            className="
                              text-[7px]
                              font-black
                              uppercase
                              tracking-[0.8px]
                              text-[#94A3B8]
                            "
                          >
                            Amount
                          </p>

                          <p
                            className="
                              mt-1.5
                              text-xs
                              font-black
                              text-[#0F172A]
                            "
                          >
                            {formatMoney(
                              student.amount
                            )}
                          </p>

                        </div>


                        <div
                          className="
                            rounded-xl
                            border
                            border-[#E7E5E0]
                            bg-white
                            p-3
                          "
                        >

                          <p
                            className="
                              text-[7px]
                              font-black
                              uppercase
                              tracking-[0.8px]
                              text-[#94A3B8]
                            "
                          >
                            Enrolled On
                          </p>

                          <p
                            className="
                              mt-1.5
                              text-[9px]
                              font-black
                              text-[#0F172A]
                            "
                          >
                            {formatDate(
                              student.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          </>

        )}

      </section>

    </div>
  );
};

export default StudentsEnrolled;