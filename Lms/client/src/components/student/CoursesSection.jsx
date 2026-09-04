import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  const featuredCourses = allCourses?.slice(0, 4) || [];

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] py-20">

      {/* Decorative background glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-20
          h-80
          w-80
          rounded-full
          bg-[#D4AF6A]/5
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-10
          h-80
          w-80
          rounded-full
          bg-[#0F172A]/5
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-[1440px]
          px-5
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >

        {/* ================================================= */}
        {/* SECTION HEADER */}
        {/* ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div className="max-w-[680px]">

            {/* Eyebrow */}

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
                  text-[#B88A3B]
                "
              >
                Featured Learning
              </span>

            </div>


            {/* Heading */}

            <h2
              className="
                text-3xl
                font-black
                leading-tight
                tracking-[-1px]
                text-[#0F172A]
                sm:text-4xl
                lg:text-[42px]
              "
            >
              Learn skills that
              <span className="text-[#B88A3B]">
                {" "}move you forward.
              </span>
            </h2>


            {/* Description */}

            <p
              className="
                mt-4
                max-w-[620px]
                text-sm
                leading-6
                text-[#64748B]
                sm:text-base
              "
            >
              Explore practical courses designed to help you
              build valuable skills, strengthen your knowledge,
              and take the next step in your career.
            </p>

          </div>


          {/* Course count */}

          <div
            className="
              hidden
              items-center
              gap-3
              rounded-2xl
              border
              border-[#E7E5E0]
              bg-white
              px-5
              py-4
              shadow-[0_10px_30px_rgba(15,23,42,0.04)]
              sm:flex
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
                  text-[#0F172A]
                "
              >
                {allCourses?.length || 0}+
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[1px]
                  text-[#94A3B8]
                "
              >
                Courses available
              </p>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* COURSE GRID */}
        {/* ================================================= */}

        {featuredCourses.length > 0 ? (
          <div
            className="
              mt-12
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >

            {featuredCourses.map((course) => (
              <div
                key={course._id}
                className="
                  group
                  min-w-0
                  transition-transform
                  duration-300
                  hover:-translate-y-1
                "
              >
                <CourseCard course={course} />
              </div>
            ))}

          </div>
        ) : (
          <div
            className="
              mt-12
              flex
              min-h-[280px]
              items-center
              justify-center
              rounded-3xl
              border
              border-dashed
              border-[#D8D4CC]
              bg-white
            "
          >

            <div className="text-center">

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
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >

                  <path
                    d="M4 5.5C4 4.67 4.67 4 5.5 4H19V19H5.5C4.67 19 4 18.33 4 17.5V5.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M8 9H15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                </svg>

              </div>


              <h3
                className="
                  mt-5
                  text-lg
                  font-bold
                  text-[#0F172A]
                "
              >
                Courses coming soon
              </h3>


              <p
                className="
                  mt-2
                  text-sm
                  text-[#94A3B8]
                "
              >
                New learning experiences are being prepared.
              </p>

            </div>

          </div>
        )}


        {/* ================================================= */}
        {/* BOTTOM CTA */}
        {/* ================================================= */}

        <div
          className="
            mt-12
            flex
            flex-col
            items-center
            justify-between
            gap-5
            rounded-3xl
            border
            border-[#E7E5E0]
            bg-white
            px-6
            py-6
            shadow-[0_12px_35px_rgba(15,23,42,0.04)]
            sm:flex-row
            sm:px-8
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
              Looking for something specific?
            </p>

            <p
              className="
                mt-1
                text-xs
                text-[#94A3B8]
              "
            >
              Browse the complete course library.
            </p>

          </div>


          <Link
            to="/course-list"
            onClick={() => window.scrollTo(0, 0)}
            className="
              inline-flex
              min-w-[170px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#0F172A]
              px-6
              py-3
              text-sm
              font-bold
              text-white
              transition-all
              duration-200
              hover:bg-[#1B263B]
              hover:shadow-[0_10px_25px_rgba(15,23,42,0.15)]
            "
          >

            Explore all courses

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

          </Link>

        </div>

      </div>

    </section>
  );
};

export default CoursesSection;