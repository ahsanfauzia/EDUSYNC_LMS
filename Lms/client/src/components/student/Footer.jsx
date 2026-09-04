import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0F172A] text-white">

      {/* Decorative glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-72
          w-72
          rounded-full
          bg-[#D4AF6A]/5
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
        {/* MAIN FOOTER */}
        {/* ================================================= */}

        <div
          className="
            grid
            gap-12
            border-b
            border-white/10
            py-14
            md:grid-cols-2
            lg:grid-cols-[1.5fr_1fr_1fr_1fr]
          "
        >

          {/* BRAND */}

          <div className="max-w-[390px]">

            <Link
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-3"
            >

              <span
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#D4AF6A]
                  text-sm
                  font-black
                  text-[#0F172A]
                "
              >
                ES
              </span>

              <span
                className="
                  text-xl
                  font-black
                  tracking-[-0.5px]
                "
              >
                Edu
                <span className="text-[#D4AF6A]">
                  Sync
                </span>
              </span>

            </Link>


            <p
              className="
                mt-5
                text-sm
                leading-7
                text-[#94A3B8]
              "
            >
              Learn with purpose. Build practical skills,
              grow your knowledge, and take your next step
              with confidence.
            </p>


            {/* Trust badge */}

            <div
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#D4AF6A]/20
                bg-[#D4AF6A]/5
                px-3
                py-2
                text-[10px]
                font-bold
                uppercase
                tracking-[1px]
                text-[#D4AF6A]
              "
            >

              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF6A]" />

              Learn. Practice. Grow.

            </div>

          </div>


          {/* QUICK LINKS */}

          <div>

            <h3
              className="
                text-xs
                font-black
                uppercase
                tracking-[1.5px]
                text-white
              "
            >
              Explore
            </h3>

            <ul
              className="
                mt-5
                space-y-3
              "
            >

              <li>
                <Link
                  to="/"
                  className="
                    text-sm
                    text-[#94A3B8]
                    transition-colors
                    hover:text-[#D4AF6A]
                  "
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/course-list"
                  className="
                    text-sm
                    text-[#94A3B8]
                    transition-colors
                    hover:text-[#D4AF6A]
                  "
                >
                  Explore Courses
                </Link>
              </li>

              <li>
                <Link
                  to="/my-enrollments"
                  className="
                    text-sm
                    text-[#94A3B8]
                    transition-colors
                    hover:text-[#D4AF6A]
                  "
                >
                  My Learning
                </Link>
              </li>

            </ul>

          </div>


          {/* LEARNING */}

          <div>

            <h3
              className="
                text-xs
                font-black
                uppercase
                tracking-[1.5px]
                text-white
              "
            >
              Learning
            </h3>

            <ul
              className="
                mt-5
                space-y-3
              "
            >

              <li>
                <span
                  className="
                    text-sm
                    text-[#94A3B8]
                  "
                >
                  Expert-led Courses
                </span>
              </li>

              <li>
                <span
                  className="
                    text-sm
                    text-[#94A3B8]
                  "
                >
                  Practical Learning
                </span>
              </li>

              <li>
                <span
                  className="
                    text-sm
                    text-[#94A3B8]
                  "
                >
                  Learn at Your Pace
                </span>
              </li>

            </ul>

          </div>


          {/* PLATFORM */}

          <div>

            <h3
              className="
                text-xs
                font-black
                uppercase
                tracking-[1.5px]
                text-white
              "
            >
              Platform
            </h3>

            <ul
              className="
                mt-5
                space-y-3
              "
            >

              <li>
                <Link
                  to="/course-list"
                  className="
                    text-sm
                    text-[#94A3B8]
                    transition-colors
                    hover:text-[#D4AF6A]
                  "
                >
                  Browse Courses
                </Link>
              </li>

              <li>
                <span
                  className="
                    text-sm
                    text-[#94A3B8]
                  "
                >
                  Student Learning
                </span>
              </li>

              <li>
                <span
                  className="
                    text-sm
                    text-[#94A3B8]
                  "
                >
                  Educator Platform
                </span>
              </li>

            </ul>

          </div>

        </div>


        {/* ================================================= */}
        {/* BOTTOM BAR */}
        {/* ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-4
            py-6
            text-center
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:text-left
          "
        >

          <p
            className="
              text-[11px]
              text-[#64748B]
            "
          >
            © {currentYear} EduSync. All rights reserved.
          </p>


          <div
            className="
              flex
              items-center
              justify-center
              gap-4
            "
          >

            <span
              className="
                text-[10px]
                font-medium
                text-[#64748B]
              "
            >
              Built for better learning
            </span>

            <span
              className="
                h-1
                w-1
                rounded-full
                bg-[#D4AF6A]
              "
            />

            <span
              className="
                text-[10px]
                font-bold
                text-[#D4AF6A]
              "
            >
              EduSync
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;