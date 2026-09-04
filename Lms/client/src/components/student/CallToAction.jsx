import React from "react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] py-20">

      {/* ================================================= */}
      {/* DECORATIVE BACKGROUND */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-1/2
          h-72
          w-72
          -translate-y-1/2
          rounded-full
          bg-[#D4AF6A]/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          top-1/2
          h-72
          w-72
          -translate-y-1/2
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
        {/* MAIN CTA */}
        {/* ================================================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            bg-[#0F172A]
            px-6
            py-12
            sm:px-10
            sm:py-14
            lg:px-16
            lg:py-16
          "
        >

          {/* Gold decorative circle */}

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              border
              border-[#D4AF6A]/15
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -right-10
              -top-10
              h-44
              w-44
              rounded-full
              border
              border-[#D4AF6A]/10
            "
          />


          {/* Small gold line */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              h-1
              w-32
              bg-[#D4AF6A]
            "
          />


          <div
            className="
              relative
              z-10
              grid
              items-center
              gap-10
              lg:grid-cols-[1fr_auto]
            "
          >

            {/* ================================================= */}
            {/* LEFT CONTENT */}
            {/* ================================================= */}

            <div className="max-w-[760px]">

              {/* Eyebrow */}

              <div
                className="
                  mb-5
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
                  Start Your Learning Journey
                </span>

              </div>


              {/* Heading */}

              <h2
                className="
                  max-w-[700px]
                  text-3xl
                  font-black
                  leading-[1.15]
                  tracking-[-1px]
                  text-white
                  sm:text-4xl
                  lg:text-[48px]
                "
              >
                Your next skill could
                <span className="text-[#D4AF6A]">
                  {" "}change your future.
                </span>
              </h2>


              {/* Description */}

              <p
                className="
                  mt-5
                  max-w-[620px]
                  text-sm
                  leading-7
                  text-[#CBD5E1]
                  sm:text-base
                "
              >
                Learn from practical courses, build valuable
                skills, and make meaningful progress — one
                lesson at a time.
              </p>


              {/* Trust points */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-x-6
                  gap-y-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-[#CBD5E1]
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
                      bg-[#D4AF6A]/15
                      text-[10px]
                      font-black
                      text-[#D4AF6A]
                    "
                  >
                    ✓
                  </span>

                  Expert-led courses

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-[#CBD5E1]
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
                      bg-[#D4AF6A]/15
                      text-[10px]
                      font-black
                      text-[#D4AF6A]
                    "
                  >
                    ✓
                  </span>

                  Learn at your pace

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-[#CBD5E1]
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
                      bg-[#D4AF6A]/15
                      text-[10px]
                      font-black
                      text-[#D4AF6A]
                    "
                  >
                    ✓
                  </span>

                  Practical learning

                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* RIGHT CTA */}
            {/* ================================================= */}

            <div
              className="
                flex
                shrink-0
                flex-col
                items-start
                gap-3
                lg:items-end
              "
            >

              <Link
                to="/course-list"
                onClick={() => window.scrollTo(0, 0)}
                className="
                  group
                  inline-flex
                  min-w-[200px]
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-[#D4AF6A]
                  px-7
                  py-4
                  text-sm
                  font-black
                  text-[#0F172A]
                  shadow-[0_12px_30px_rgba(212,175,106,0.15)]
                  transition-all
                  duration-200
                  hover:bg-[#E3C78D]
                  hover:shadow-[0_15px_35px_rgba(212,175,106,0.25)]
                  active:scale-[0.98]
                "
              >

                Explore Courses

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                >

                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <path
                    d="M13 6L19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

              </Link>


              <p
                className="
                  text-[10px]
                  font-medium
                  text-[#64748B]
                "
              >
                Start learning today
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default CallToAction;