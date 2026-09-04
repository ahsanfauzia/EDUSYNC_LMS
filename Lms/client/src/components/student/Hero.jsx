import React, {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AppContext,
} from "../../context/AppContext";


const Hero = () => {

  const navigate = useNavigate();

  const {
    allCourses,
  } = useContext(AppContext);


  const [searchInput, setSearchInput] =
    useState("");


  const handleSearch = (e) => {
    e.preventDefault();

    const value =
      searchInput.trim();

    if (!value) {
      navigate("/course-list");
      return;
    }

    navigate(
      `/course-list/search/${encodeURIComponent(
        value
      )}`
    );
  };


  const featuredCourses =
    allCourses?.filter(
      (course) =>
        course?.isPublished !== false
    ) || [];


  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#FAF9F6]
      "
    >

      {/* ================================================= */}
      {/* DECORATIVE BACKGROUND */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          -top-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#D4AF6A]/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-48
          -left-48
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#0F172A]/5
          blur-3xl
        "
      />


      {/* ================================================= */}
      {/* HERO CONTAINER */}
      {/* ================================================= */}

      <div
        className="
          relative
          mx-auto
          grid
          min-h-[680px]
          max-w-[1440px]
          items-center
          gap-12
          px-5
          py-16
          sm:px-8
          lg:grid-cols-[1.05fr_0.95fr]
          lg:px-12
          lg:py-20
          xl:px-16
        "
      >

        {/* ================================================= */}
        {/* LEFT CONTENT */}
        {/* ================================================= */}

        <div
          className="
            relative
            z-10
            max-w-[700px]
          "
        >

          {/* Eyebrow */}

          <div
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#D4AF6A]/40
              bg-[#F5E8C8]/35
              px-3.5
              py-2
              text-[11px]
              font-bold
              uppercase
              tracking-[1.5px]
              text-[#765522]
            "
          >

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#D4AF6A]
                shadow-[0_0_0_4px_rgba(212,175,106,0.12)]
              "
            />

            Learn With Purpose

          </div>


          {/* Heading */}

          <h1
            className="
              max-w-[680px]
              text-[45px]
              font-black
              leading-[1.04]
              tracking-[-2px]
              text-[#0F172A]
              sm:text-[58px]
              lg:text-[66px]
              xl:text-[72px]
            "
          >

            Build Skills.

            <br />

            <span
              className="
                text-[#B88A3B]
              "
            >
              Build Your
            </span>

            <br />

            Future.

          </h1>


          {/* Description */}

          <p
            className="
              mt-7
              max-w-[590px]
              text-[16px]
              leading-7
              text-[#64748B]
              sm:text-[17px]
            "
          >
            Learn practical, career-focused skills from
            expert instructors and move confidently
            toward your next opportunity.
          </p>


          {/* ================================================= */}
          {/* SEARCH */}
          {/* ================================================= */}

          <form
            onSubmit={handleSearch}
            className="
              mt-8
              flex
              max-w-[590px]
              flex-col
              gap-2
              rounded-2xl
              border
              border-[#DDD8CE]
              bg-white
              p-2
              shadow-[0_15px_45px_rgba(15,23,42,0.08)]
              sm:flex-row
              sm:items-center
            "
          >

            <div
              className="
                flex
                min-w-0
                flex-1
                items-center
                gap-3
                px-3
              "
            >

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="
                  shrink-0
                  text-[#B88A3B]
                "
              >

                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M16 16L21 21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

              </svg>


              <input
                type="text"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(
                    e.target.value
                  )
                }
                placeholder="What do you want to learn?"
                className="
                  h-12
                  min-w-0
                  flex-1
                  bg-transparent
                  text-sm
                  font-medium
                  text-[#171717]
                  outline-none
                  placeholder:text-[#94A3B8]
                "
              />

            </div>


            <button
              type="submit"
              className="
                flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#0F172A]
                px-6
                text-sm
                font-bold
                text-white
                transition-all
                duration-200
                hover:bg-[#1B263B]
                sm:min-w-[125px]
              "
            >

              Search

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

            </button>

          </form>


          {/* ================================================= */}
          {/* TRUST POINTS */}
          {/* ================================================= */}

          <div
            className="
              mt-7
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3
              text-xs
              font-semibold
              text-[#64748B]
            "
          >

            <div className="flex items-center gap-2">

              <span
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F5E8C8]
                  text-[#8B672B]
                "
              >
                ✓
              </span>

              Expert Instructors

            </div>


            <div className="flex items-center gap-2">

              <span
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F5E8C8]
                  text-[#8B672B]
                "
              >
                ✓
              </span>

              Practical Learning

            </div>


            <div className="flex items-center gap-2">

              <span
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F5E8C8]
                  text-[#8B672B]
                "
              >
                ✓
              </span>

              Learn At Your Pace

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* RIGHT VISUAL */}
        {/* ================================================= */}

        <div
          className="
            relative
            hidden
            min-h-[500px]
            lg:block
          "
        >

          {/* Main dark panel */}

          <div
            className="
              absolute
              right-0
              top-1/2
              h-[430px]
              w-[430px]
              -translate-y-1/2
              overflow-hidden
              rounded-[38px]
              bg-[#0F172A]
              shadow-[0_35px_80px_rgba(15,23,42,0.22)]
            "
          >

            {/* Gold glow */}

            <div
              className="
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                bg-[#D4AF6A]/20
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-28
                -left-24
                h-72
                w-72
                rounded-full
                bg-white/5
                blur-3xl
              "
            />


            {/* Decorative grid */}

            <div
              className="
                absolute
                inset-0
                opacity-[0.055]
              "
              style={{
                backgroundImage:
                  "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                backgroundSize:
                  "38px 38px",
              }}
            />


            {/* Content */}

            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                justify-between
                p-9
              "
            >

              <div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <span
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[2px]
                      text-[#D4AF6A]
                    "
                  >
                    EduSync Academy
                  </span>


                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#D4AF6A]/30
                      bg-[#D4AF6A]/10
                    "
                  >

                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <path
                        d="M12 3L20 7L12 11L4 7L12 3Z"
                        stroke="#D4AF6A"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </div>

                </div>


                <h2
                  className="
                    mt-12
                    max-w-[310px]
                    text-[42px]
                    font-black
                    leading-[1.05]
                    tracking-[-1.5px]
                    text-white
                  "
                >
                  Turn Learning Into
                  <span className="text-[#D4AF6A]">
                    {" "}Progress.
                  </span>
                </h2>

              </div>


              {/* Bottom stats card */}

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.07]
                  p-5
                  backdrop-blur-md
                "
              >

                <div
                  className="
                    flex
                    items-end
                    justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[1.5px]
                        text-white/40
                      "
                    >
                      Learning Library
                    </p>

                    <p
                      className="
                        mt-1
                        text-3xl
                        font-black
                        text-white
                      "
                    >
                      {featuredCourses.length > 0
                        ? `${featuredCourses.length}+`
                        : "50+"}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-white/50
                      "
                    >
                      Courses available
                    </p>

                  </div>


                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-[#D4AF6A]/10
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      text-[#E5C989]
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

                    Growing Daily

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Floating badge */}

          <div
            className="
              absolute
              -left-5
              top-[82px]
              z-20
              rounded-2xl
              border
              border-[#E7E5E0]
              bg-white
              px-5
              py-4
              shadow-[0_20px_50px_rgba(15,23,42,0.12)]
            "
          >

            <div className="flex items-center gap-3">

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
                    d="M12 3L14.8 8.7L21 9.6L16.5 14L17.6 20.2L12 17.3L6.4 20.2L7.5 14L3 9.6L9.2 8.7L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />

                </svg>

              </div>


              <div>

                <p
                  className="
                    text-xs
                    font-bold
                    text-[#0F172A]
                  "
                >
                  Learn. Practice.
                </p>

                <p
                  className="
                    text-[11px]
                    text-[#94A3B8]
                  "
                >
                  Grow every day.
                </p>

              </div>

            </div>

          </div>


          {/* Floating number */}

          <div
            className="
              absolute
              -bottom-3
              right-8
              z-20
              rounded-2xl
              border
              border-[#D4AF6A]/30
              bg-[#FAF9F6]
              px-5
              py-4
              shadow-[0_20px_50px_rgba(15,23,42,0.10)]
            "
          >

            <p
              className="
                text-2xl
                font-black
                text-[#0F172A]
              "
            >
              4.9
              <span
                className="
                  ml-1
                  text-sm
                  text-[#B88A3B]
                "
              >
                ★
              </span>
            </p>

            <p
              className="
                mt-0.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[1px]
                text-[#94A3B8]
              "
            >
              Learner Rating
            </p>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* BOTTOM GOLD LINE */}
      {/* ================================================= */}

      <div
        className="
          mx-auto
          h-px
          max-w-[1320px]
          bg-gradient-to-r
          from-transparent
          via-[#D4AF6A]/40
          to-transparent
        "
      />

    </section>
  );
};


export default Hero;