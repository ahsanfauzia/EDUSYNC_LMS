import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";

const MyCourses = () => {
  const {
    backendUrl,
    getToken,
    currency,
  } = useContext(AppContext);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEducatorCourses = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        toast.error("Please login again.");
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

      if (data.success) {
        setCourses(data.courses || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, []);

  const summary = useMemo(() => {
    const totalStudents = courses.reduce(
      (sum, course) =>
        sum +
        (course.enrolledStudents?.length || 0),
      0
    );

    const totalEarnings = courses.reduce(
      (sum, course) => {
        const students =
          course.enrolledStudents?.length || 0;

        const price =
          Number(course.coursePrice) || 0;

        const discount =
          Number(course.discount) || 0;

        const earningPerStudent =
          price -
          (discount * price) / 100;

        return (
          sum +
          students * earningPerStudent
        );
      },
      0
    );

    return {
      totalCourses: courses.length,
      totalStudents,
      totalEarnings,
    };
  }, [courses]);

  const formatMoney = (amount) => {
    return `${currency}${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="w-full">

        {/* HEADER */}
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
                sm:text-3xl
              "
            >
              My Courses
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-[#CBD5E1]
              "
            >
              Manage and monitor your
              published learning content.
            </p>
          </div>
        </section>

        {/* LOADING */}
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
              Loading your courses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* =====================================================
          HERO
      ===================================================== */}

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
            bottom-[-100px]
            left-[35%]
            h-52
            w-52
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
              Course Management
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
                My Courses
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
                Keep track of your courses,
                learners, and overall course
                earnings from one place.
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
                {courses.length}{" "}
                {courses.length === 1
                  ? "Course"
                  : "Courses"}
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section
        className="
          mt-6
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-3
        "
      >

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
                Total Courses
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-[#0F172A]
                "
              >
                {summary.totalCourses}
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
                  d="M8 8H16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="M8 12H16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>


        {/* STUDENTS */}

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
                Total Students
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-[#0F172A]
                "
              >
                {summary.totalStudents}
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
                  d="M16 20V18C16 16.34 14.66 15 13 15H7C5.34 15 4 16.34 4 18V20"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <circle
                  cx="10"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M17 11C18.66 11 20 12.34 20 14V16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="M16 5.2C17.1 5.65 18 6.72 18 8C18 9.28 17.1 10.35 16 10.8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>


        {/* EARNINGS */}

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
                Estimated Earnings
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-[#0F172A]
                "
              >
                {formatMoney(
                  summary.totalEarnings
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


      {/* =====================================================
          COURSE LIST
      ===================================================== */}

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
              Your Library
            </p>

            <h2
              className="
                mt-1.5
                text-lg
                font-black
                text-[#0F172A]
              "
            >
              Course performance
            </h2>
          </div>

          <p
            className="
              text-[9px]
              font-semibold
              text-[#94A3B8]
            "
          >
            Earnings are based on enrolled
            students and course price.
          </p>

        </div>


        {/* DESKTOP TABLE */}

        {courses.length > 0 ? (

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-[760px]">

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
                    Earnings
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
                    Students
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
                    Created
                  </th>

                </tr>
              </thead>


              <tbody>

                {courses.map((course) => {

                  const students =
                    course.enrolledStudents
                      ?.length || 0;

                  const price =
                    Number(
                      course.coursePrice
                    ) || 0;

                  const discount =
                    Number(
                      course.discount
                    ) || 0;

                  const earnings =
                    students *
                    (
                      price -
                      (
                        discount *
                        price
                      ) /
                        100
                    );

                  return (
                    <tr
                      key={course._id}
                      className="
                        border-b
                        border-[#F0EEE9]
                        transition
                        last:border-0
                        hover:bg-[#FAF9F6]
                      "
                    >

                      {/* COURSE */}

                      <td className="px-6 py-5">

                        <div
                          className="
                            flex
                            min-w-[280px]
                            items-center
                            gap-4
                          "
                        >

                          <div
                            className="
                              relative
                              h-14
                              w-24
                              shrink-0
                              overflow-hidden
                              rounded-xl
                              bg-[#F5E8C8]
                            "
                          >

                            <img
                              src={
                                course.courseThumbnail
                              }
                              alt={
                                course.courseTitle
                              }
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />

                          </div>


                          <div className="min-w-0">

                            <p
                              className="
                                line-clamp-2
                                text-xs
                                font-black
                                leading-5
                                text-[#0F172A]
                              "
                            >
                              {
                                course.courseTitle
                              }
                            </p>

                            <span
                              className="
                                mt-1.5
                                inline-flex
                                rounded-full
                                bg-[#F5E8C8]
                                px-2
                                py-1
                                text-[7px]
                                font-black
                                uppercase
                                tracking-[0.8px]
                                text-[#8B672B]
                              "
                            >
                              Course
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* EARNINGS */}

                      <td className="px-6 py-5">

                        <span
                          className="
                            text-sm
                            font-black
                            text-[#0F172A]
                          "
                        >
                          {formatMoney(
                            earnings
                          )}
                        </span>

                      </td>


                      {/* STUDENTS */}

                      <td className="px-6 py-5">

                        <div
                          className="
                            flex
                            items-center
                            gap-2
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
                              bg-[#0F172A]
                              text-[9px]
                              font-black
                              text-[#D4AF6A]
                            "
                          >
                            {students}
                          </span>

                          <span
                            className="
                              text-[9px]
                              font-bold
                              text-[#64748B]
                            "
                          >
                            learners
                          </span>

                        </div>

                      </td>


                      {/* DATE */}

                      <td className="px-6 py-5">

                        <p
                          className="
                            text-[10px]
                            font-bold
                            text-[#475569]
                          "
                        >
                          {formatDate(
                            course.createdAt
                          )}
                        </p>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        ) : (

          /* EMPTY DESKTOP/MOBILE */

          <div
            className="
              flex
              min-h-[300px]
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
                width="26"
                height="26"
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

            <h3
              className="
                mt-5
                text-sm
                font-black
                text-[#0F172A]
              "
            >
              No courses found
            </h3>

            <p
              className="
                mt-2
                max-w-sm
                text-[10px]
                leading-5
                text-[#94A3B8]
              "
            >
              Your courses will appear here once
              you create them.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          MOBILE COURSE CARDS
      ===================================================== */}

      {courses.length > 0 && (

        <div className="mt-4 space-y-4 md:hidden">

          {courses.map((course) => {

            const students =
              course.enrolledStudents
                ?.length || 0;

            const price =
              Number(
                course.coursePrice
              ) || 0;

            const discount =
              Number(
                course.discount
              ) || 0;

            const earnings =
              students *
              (
                price -
                (
                  discount *
                  price
                ) /
                  100
              );

            return (
              <article
                key={course._id}
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
                    gap-4
                    p-4
                  "
                >

                  <img
                    src={
                      course.courseThumbnail
                    }
                    alt={
                      course.courseTitle
                    }
                    className="
                      h-20
                      w-28
                      shrink-0
                      rounded-xl
                      object-cover
                    "
                  />

                  <div className="min-w-0">

                    <p
                      className="
                        line-clamp-2
                        text-xs
                        font-black
                        leading-5
                        text-[#0F172A]
                      "
                    >
                      {
                        course.courseTitle
                      }
                    </p>

                    <span
                      className="
                        mt-2
                        inline-flex
                        rounded-full
                        bg-[#F5E8C8]
                        px-2
                        py-1
                        text-[7px]
                        font-black
                        uppercase
                        tracking-[0.8px]
                        text-[#8B672B]
                      "
                    >
                      Course
                    </span>

                  </div>

                </div>


                <div
                  className="
                    grid
                    grid-cols-3
                    border-t
                    border-[#E7E5E0]
                    bg-[#FAF9F6]
                  "
                >

                  <div
                    className="
                      border-r
                      border-[#E7E5E0]
                      p-4
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
                      Earnings
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        font-black
                        text-[#0F172A]
                      "
                    >
                      {formatMoney(
                        earnings
                      )}
                    </p>
                  </div>


                  <div
                    className="
                      border-r
                      border-[#E7E5E0]
                      p-4
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
                      Students
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        font-black
                        text-[#0F172A]
                      "
                    >
                      {students}
                    </p>
                  </div>


                  <div className="p-4">

                    <p
                      className="
                        text-[7px]
                        font-black
                        uppercase
                        tracking-[0.8px]
                        text-[#94A3B8]
                      "
                    >
                      Created
                    </p>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        font-black
                        text-[#0F172A]
                      "
                    >
                      {formatDate(
                        course.createdAt
                      )}
                    </p>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default MyCourses;