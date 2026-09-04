import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const {
    backendUrl,
    getToken,
    navigate,
  } = useContext(AppContext);

  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalEarnings: 0,
    enrolledStudentsData: [],
  });

  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH DASHBOARD DATA
  // =========================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/educator/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setDashboardData({
          totalCourses: data.dashboardData?.totalCourses || 0,
          totalEarnings:
            Number(data.dashboardData?.totalEarnings) || 0,
          enrolledStudentsData:
            data.dashboardData?.enrolledStudentsData || [],
        });
      } else {
        toast.error(
          data.message || "Unable to load dashboard."
        );
      }
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =========================================================
  // DERIVED DATA
  // =========================================================

  const students =
    dashboardData.enrolledStudentsData || [];

  const totalStudents = students.length;

  const uniqueStudents = useMemo(() => {
    const names = students.map(
      (student) =>
        `${student.studentName}-${student.email}`
    );

    return new Set(names).size;
  }, [students]);

  const recentStudents = students.slice(0, 5);

  const averageRevenuePerEnrollment =
    totalStudents > 0
      ? dashboardData.totalEarnings / totalStudents
      : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-[70vh]">

        <div className="animate-pulse">

          <div className="h-7 w-48 rounded-lg bg-[#E7E5E0]" />

          <div className="mt-3 h-4 w-80 rounded bg-[#E7E5E0]" />

          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-36
                  rounded-2xl
                  border
                  border-[#E7E5E0]
                  bg-white
                "
              />
            ))}
          </div>

          <div
            className="
              mt-6
              h-96
              rounded-2xl
              border
              border-[#E7E5E0]
              bg-white
            "
          />

        </div>

      </div>
    );
  }

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
          shadow-[0_15px_40px_rgba(15,23,42,0.10)]
          sm:px-8
          sm:py-8
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-28
            h-72
            w-72
            rounded-full
            bg-[#D4AF6A]/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            left-1/3
            h-72
            w-72
            rounded-full
            bg-white/5
            blur-3xl
          "
        />

        <div className="relative">

          <div className="flex items-center gap-3">

            <span
              className="
                h-px
                w-9
                bg-[#D4AF6A]
              "
            />

            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[2px]
                text-[#D4AF6A]
              "
            >
              Educator Workspace
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
                  lg:text-4xl
                "
              >
                Welcome back, Educator.
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
                Manage your courses, understand your
                learner activity, and keep your academy
                moving forward.
              </p>

            </div>


            <button
              onClick={() => navigate("/educator/add-course")}
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-xl
                bg-[#D4AF6A]
                px-5
                py-3
                text-xs
                font-black
                text-[#0F172A]
                transition
                hover:bg-[#E2C27F]
                active:scale-[0.98]
              "
            >

              <span className="text-base leading-none">
                +
              </span>

              Create New Course

            </button>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* STAT CARDS */}
      {/* ===================================================== */}

      <section
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* Courses */}

        <div
          className="
            group
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            transition
            hover:-translate-y-1
            hover:border-[#D4AF6A]/40
            hover:shadow-[0_15px_35px_rgba(15,23,42,0.07)]
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
                Total Courses
              </p>

              <p
                className="
                  mt-3
                  text-3xl
                  font-black
                  tracking-[-1px]
                  text-[#0F172A]
                "
              >
                {dashboardData.totalCourses}
              </p>

            </div>


            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#F5E8C8]
                text-[#8B672B]
              "
            >

              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 5.5C4 4.67 4.67 4 5.5 4H20V18H5.5C4.67 18 4 18.67 4 19.5V5.5Z"
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

          </div>


          <p
            className="
              mt-5
              text-[10px]
              font-medium
              text-[#94A3B8]
            "
          >
            Courses published in your academy
          </p>

        </div>


        {/* Earnings */}

        <div
          className="
            group
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            transition
            hover:-translate-y-1
            hover:border-[#D4AF6A]/40
            hover:shadow-[0_15px_35px_rgba(15,23,42,0.07)]
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
                Total Earnings
              </p>

              <p
                className="
                  mt-3
                  text-2xl
                  font-black
                  tracking-[-0.8px]
                  text-[#0F172A]
                "
              >
                {formatCurrency(
                  dashboardData.totalEarnings
                )}
              </p>

            </div>


            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#0F172A]
                text-[#D4AF6A]
              "
            >

              <svg
                width="21"
                height="21"
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
                  d="M14.5 9.5C14 8.8 13.2 8.5 12.2 8.5C11 8.5 10 9.1 10 10.1C10 11.2 11 11.5 12.2 11.8C13.5 12.1 14.5 12.5 14.5 13.7C14.5 14.8 13.5 15.5 12.2 15.5C11.1 15.5 10.2 15.1 9.6 14.4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M12 7V17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

              </svg>

            </div>

          </div>


          <p
            className="
              mt-5
              text-[10px]
              font-medium
              text-[#94A3B8]
            "
          >
            From completed course purchases
          </p>

        </div>


        {/* Students */}

        <div
          className="
            group
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            transition
            hover:-translate-y-1
            hover:border-[#D4AF6A]/40
            hover:shadow-[0_15px_35px_rgba(15,23,42,0.07)]
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
                Enrollments
              </p>

              <p
                className="
                  mt-3
                  text-3xl
                  font-black
                  tracking-[-1px]
                  text-[#0F172A]
                "
              >
                {totalStudents}
              </p>

            </div>


            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#F5E8C8]
                text-[#8B672B]
              "
            >

              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
              >

                <circle
                  cx="9"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M3.5 19C3.5 15.96 5.96 13.5 9 13.5C12.04 13.5 14.5 15.96 14.5 19"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                <path
                  d="M15 5.5C16.93 5.5 18.5 7.07 18.5 9C18.5 10.93 16.93 12.5 15 12.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                <path
                  d="M16.5 14C19 14.5 20.5 16.2 20.5 19"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

              </svg>

            </div>

          </div>


          <p
            className="
              mt-5
              text-[10px]
              font-medium
              text-[#94A3B8]
            "
          >
            Total completed enrollments
          </p>

        </div>


        {/* Average */}

        <div
          className="
            group
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-5
            transition
            hover:-translate-y-1
            hover:border-[#D4AF6A]/40
            hover:shadow-[0_15px_35px_rgba(15,23,42,0.07)]
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
                Avg. Enrollment
              </p>

              <p
                className="
                  mt-3
                  text-2xl
                  font-black
                  tracking-[-0.8px]
                  text-[#0F172A]
                "
              >
                {formatCurrency(
                  averageRevenuePerEnrollment
                )}
              </p>

            </div>


            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#0F172A]
                text-[#D4AF6A]
              "
            >

              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
              >

                <path
                  d="M5 18L10 13L13.5 16.5L20 10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M15 10H20V15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

            </div>

          </div>


          <p
            className="
              mt-5
              text-[10px]
              font-medium
              text-[#94A3B8]
            "
          >
            Average revenue per enrollment
          </p>

        </div>

      </section>


      {/* ===================================================== */}
      {/* MAIN GRID */}
      {/* ===================================================== */}

      <section
        className="
          grid
          gap-6
          xl:grid-cols-[1fr_360px]
        "
      >

        {/* =================================================== */}
        {/* RECENT STUDENTS */}
        {/* =================================================== */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              border-[#E7E5E0]
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:p-6
            "
          >

            <div>

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[1.5px]
                  text-[#B88A3B]
                "
              >
                Learner Activity
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


            <button
              onClick={() =>
                navigate("/educator/student-enrolled")
              }
              className="
                flex
                w-fit
                items-center
                gap-1.5
                text-[10px]
                font-black
                text-[#8B672B]
                transition
                hover:text-[#0F172A]
              "
            >
              View all

              <svg
                width="14"
                height="14"
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


          {recentStudents.length > 0 ? (

            <div>

              {recentStudents.map(
                (student, index) => (
                  <div
                    key={`${student.email}-${index}`}
                    className="
                      flex
                      items-center
                      gap-4
                      border-b
                      border-[#E7E5E0]
                      px-5
                      py-4
                      last:border-b-0
                      sm:px-6
                    "
                  >

                    {/* Avatar */}

                    <div className="relative shrink-0">

                      <img
                        src={student.imageUrl}
                        alt={student.studentName}
                        className="
                          h-11
                          w-11
                          rounded-full
                          object-cover
                          ring-2
                          ring-[#F5E8C8]
                        "
                      />

                      <span
                        className="
                          absolute
                          -bottom-0.5
                          -right-0.5
                          h-3
                          w-3
                          rounded-full
                          border-2
                          border-white
                          bg-[#D4AF6A]
                        "
                      />

                    </div>


                    {/* Info */}

                    <div className="min-w-0 flex-1">

                      <p
                        className="
                          truncate
                          text-xs
                          font-black
                          text-[#0F172A]
                        "
                      >
                        {student.studentName ||
                          "Student"}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[10px]
                          text-[#94A3B8]
                        "
                      >
                        {student.courseTitle ||
                          "Course enrollment"}
                      </p>

                    </div>


                    {/* Date */}

                    <div
                      className="
                        hidden
                        shrink-0
                        text-right
                        sm:block
                      "
                    >

                      <p
                        className="
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.7px]
                          text-[#94A3B8]
                        "
                      >
                        Enrolled
                      </p>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          font-semibold
                          text-[#475569]
                        "
                      >
                        Recently
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

          ) : (

            <div
              className="
                flex
                min-h-[280px]
                items-center
                justify-center
                px-6
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
                    <circle
                      cx="9"
                      cy="8"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <path
                      d="M3.5 19C3.5 15.96 5.96 13.5 9 13.5C12.04 13.5 14.5 15.96 14.5 19"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p
                  className="
                    mt-4
                    text-sm
                    font-black
                    text-[#0F172A]
                  "
                >
                  No enrollments yet
                </p>

                <p
                  className="
                    mt-1.5
                    text-[10px]
                    text-[#94A3B8]
                  "
                >
                  Student activity will appear here.
                </p>

              </div>

            </div>

          )}

        </div>


        {/* =================================================== */}
        {/* QUICK ACTIONS */}
        {/* =================================================== */}

        <div
          className="
            rounded-2xl
            bg-[#0F172A]
            p-6
            text-white
          "
        >

          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[1.8px]
              text-[#D4AF6A]
            "
          >
            Quick Actions
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-black
              leading-7
            "
          >
            Build a better learning
            experience.
          </h2>

          <p
            className="
              mt-2
              text-[10px]
              leading-5
              text-[#94A3B8]
            "
          >
            Create content, manage your courses,
            and stay connected with your learners.
          </p>


          <div className="mt-6 space-y-3">

            <button
              onClick={() =>
                navigate("/educator/add-course")
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-white/10
                bg-white/5
                p-3
                text-left
                transition
                hover:border-[#D4AF6A]/40
                hover:bg-white/10
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
                  bg-[#D4AF6A]
                  text-lg
                  font-black
                  text-[#0F172A]
                "
              >
                +
              </span>

              <span>

                <span
                  className="
                    block
                    text-xs
                    font-black
                  "
                >
                  Add a new course
                </span>

                <span
                  className="
                    mt-0.5
                    block
                    text-[9px]
                    text-[#94A3B8]
                  "
                >
                  Publish your next course
                </span>

              </span>

            </button>


            <button
              onClick={() =>
                navigate("/educator/my-courses")
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-white/10
                bg-white/5
                p-3
                text-left
                transition
                hover:border-[#D4AF6A]/40
                hover:bg-white/10
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
                  bg-white/10
                  text-[#D4AF6A]
                "
              >

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 5.5C4 4.67 4.67 4 5.5 4H20V18H5.5C4.67 18 4 18.67 4 19.5V5.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>

              </span>

              <span>

                <span
                  className="
                    block
                    text-xs
                    font-black
                  "
                >
                  Manage courses
                </span>

                <span
                  className="
                    mt-0.5
                    block
                    text-[9px]
                    text-[#94A3B8]
                  "
                >
                  Edit and organize content
                </span>

              </span>

            </button>


            <button
              onClick={() =>
                navigate(
                  "/educator/student-enrolled"
                )
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-white/10
                bg-white/5
                p-3
                text-left
                transition
                hover:border-[#D4AF6A]/40
                hover:bg-white/10
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
                  bg-white/10
                  text-[#D4AF6A]
                "
              >

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                >

                  <circle
                    cx="9"
                    cy="8"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M3.5 19C3.5 15.96 5.96 13.5 9 13.5C12.04 13.5 14.5 15.96 14.5 19"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                </svg>

              </span>

              <span>

                <span
                  className="
                    block
                    text-xs
                    font-black
                  "
                >
                  View learners
                </span>

                <span
                  className="
                    mt-0.5
                    block
                    text-[9px]
                    text-[#94A3B8]
                  "
                >
                  See enrolled students
                </span>

              </span>

            </button>

          </div>


          {/* Bottom highlight */}

          <div
            className="
              mt-6
              border-t
              border-white/10
              pt-5
            "
          >

            <div className="flex items-center gap-3">

              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#D4AF6A]
                  text-xs
                  font-black
                  text-[#0F172A]
                "
              >
                ✓
              </span>

              <p
                className="
                  text-[9px]
                  leading-4
                  text-[#94A3B8]
                "
              >
                Every course you publish is an
                opportunity to create meaningful
                learning.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* FOOTER INSIGHT */}
      {/* ===================================================== */}

      <section
        className="
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-[#E7E5E0]
          bg-white
          p-5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-6
        "
      >

        <div className="flex items-center gap-3">

          <span
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
            ★
          </span>

          <div>

            <p
              className="
                text-xs
                font-black
                text-[#0F172A]
              "
            >
              Academy Snapshot
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                text-[#94A3B8]
              "
            >
              {uniqueStudents} unique learner
              {uniqueStudents === 1 ? "" : "s"} have
              joined your courses.
            </p>

          </div>

        </div>


        <div
          className="
            flex
            items-center
            gap-2
            text-[9px]
            font-bold
            uppercase
            tracking-[1px]
            text-[#8B672B]
          "
        >

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#D4AF6A]
            "
          />

          EduSync Educator Panel

        </div>

      </section>

    </div>
  );
};

export default Dashboard;