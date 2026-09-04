import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import CourseCard from "../../components/student/CourseCard";
import Footer from "../../components/student/Footer";

const CoursesList = () => {
  const { allCourses } = useContext(AppContext);
  const { input } = useParams();
  const navigate = useNavigate();

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    let courses = [...(allCourses || [])];

    if (input) {
      courses = courses.filter((course) =>
        course.courseTitle
          ?.toLowerCase()
          .includes(input.toLowerCase())
      );
    }

    if (sortBy === "rating") {
      courses.sort((a, b) => {
        const ratingA = a.courseRatings?.length
          ? a.courseRatings.reduce(
              (sum, item) => sum + item.rating,
              0
            ) / a.courseRatings.length
          : 0;

        const ratingB = b.courseRatings?.length
          ? b.courseRatings.reduce(
              (sum, item) => sum + item.rating,
              0
            ) / b.courseRatings.length
          : 0;

        return ratingB - ratingA;
      });
    }

    setFilteredCourses(courses);
  }, [allCourses, input, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-[#0F172A]">

        {/* Decorative elements */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-40
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
            -left-32
            bottom-[-150px]
            h-80
            w-80
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
            py-14
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
              className="
                transition-colors
                hover:text-[#D4AF6A]
              "
            >
              Home
            </button>

            <span>/</span>

            <span className="text-[#D4AF6A]">
              Courses
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
                  Explore & Learn
                </span>

              </div>


              <h1
                className="
                  text-3xl
                  font-black
                  leading-tight
                  tracking-[-1px]
                  text-white
                  sm:text-4xl
                  lg:text-[46px]
                "
              >
                {input
                  ? `Results for "${input}"`
                  : "Explore all courses"}
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
                Discover practical courses designed to help
                you learn valuable skills and make meaningful
                progress.
              </p>

            </div>


            {/* Course count */}

            <div
              className="
                flex
                w-fit
                items-center
                gap-3
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-5
                py-4
                backdrop-blur-sm
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#D4AF6A]
                  text-[#0F172A]
                "
              >

                <svg
                  width="19"
                  height="19"
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


              <div>

                <p
                  className="
                    text-xl
                    font-black
                    leading-none
                    text-white
                  "
                >
                  {filteredCourses.length}
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
                  Courses Found
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* COURSE LIBRARY */}
      {/* ================================================= */}

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

        {/* Toolbar */}

        <div
          className="
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-[#E7E5E0]
            bg-white
            p-4
            shadow-[0_8px_25px_rgba(15,23,42,0.04)]
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <p
              className="
                text-sm
                font-bold
                text-[#0F172A]
              "
            >
              Find your next course
            </p>

            <p
              className="
                mt-1
                text-[11px]
                text-[#94A3B8]
              "
            >
              Search by course title or browse the full library.
            </p>

          </div>


          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
            "
          >

            <div className="min-w-0 sm:w-[260px]">
              <SearchBar />
            </div>


            {/* Sort */}

            <div className="relative">

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="
                  h-11
                  w-full
                  appearance-none
                  rounded-xl
                  border
                  border-[#E7E5E0]
                  bg-[#FAF9F6]
                  px-4
                  pr-10
                  text-xs
                  font-bold
                  text-[#0F172A]
                  outline-none
                  transition
                  focus:border-[#D4AF6A]
                  sm:w-[180px]
                "
              >

                <option value="popular">
                  Most Popular
                </option>

                <option value="rating">
                  Highest Rated
                </option>

              </select>


              <svg
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                "
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
              >

                <path
                  d="M6 9L12 15L18 9"
                  stroke="#64748B"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* COURSE GRID */}
        {/* ================================================= */}

        {filteredCourses.length > 0 ? (

          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >

            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
              />
            ))}

          </div>

        ) : (

          /* ================================================= */
          /* EMPTY STATE */
          /* ================================================= */

          <div
            className="
              mt-10
              flex
              min-h-[400px]
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

            <div className="max-w-[420px] text-center">

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


              <h2
                className="
                  mt-6
                  text-xl
                  font-black
                  text-[#0F172A]
                "
              >
                No courses found
              </h2>


              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#94A3B8]
                "
              >
                We couldn't find a course matching your
                search. Try another keyword or explore all
                available courses.
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
                  text-xs
                  font-bold
                  text-white
                  transition
                  hover:bg-[#1B263B]
                "
              >
                View All Courses
              </button>

            </div>

          </div>

        )}


        {/* Bottom info */}

        {filteredCourses.length > 0 && (
          <div
            className="
              mt-10
              flex
              flex-col
              items-center
              justify-between
              gap-3
              border-t
              border-[#E7E5E0]
              pt-6
              text-center
              sm:flex-row
              sm:text-left
            "
          >

            <p
              className="
                text-[11px]
                font-medium
                text-[#94A3B8]
              "
            >
              Showing {filteredCourses.length}{" "}
              {filteredCourses.length === 1
                ? "course"
                : "courses"}
            </p>


            <div
              className="
                flex
                items-center
                gap-2
                text-[10px]
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

              Learn at your own pace

            </div>

          </div>
        )}

      </main>


      <Footer />

    </div>
  );
};

export default CoursesList;