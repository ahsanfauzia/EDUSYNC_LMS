import React, { useContext } from "react";

import { AppContext } from "../../context/AppContext";

const EducatorNavbar = () => {
  const {
    isEducator,
    user,
  } = useContext(AppContext);

  if (!isEducator) return null;

  const educatorName =
    user?.fullName ||
    user?.firstName ||
    "Educator";

  return (
    <nav
      className="
        relative
        flex
        min-h-[80px]
        items-center
        justify-between
        border-b
        border-[#E7E5E0]
        bg-white
        px-5
        sm:px-7
        lg:px-8
      "
    >

      {/* =================================================
          GOLD TOP ACCENT
      ================================================= */}

      <div
        className="
          absolute
          left-0
          top-0
          h-[2px]
          w-full
          bg-[#D4AF6A]
        "
      />


      {/* =================================================
          LEFT — PAGE BRAND
      ================================================= */}

      <div className="flex min-w-0 items-center gap-3">

        {/* Mobile / compact brand icon */}

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
            text-[10px]
            font-black
            tracking-tight
            text-[#D4AF6A]
            shadow-sm
          "
        >
          ES
        </div>


        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <h1
              className="
                truncate
                text-sm
                font-black
                tracking-tight
                text-[#0F172A]
                sm:text-base
              "
            >
              Educator Studio
            </h1>

            <span
              className="
                hidden
                rounded-full
                border
                border-[#D4AF6A]/30
                bg-[#F5E8C8]
                px-2
                py-1
                text-[7px]
                font-black
                uppercase
                tracking-[0.8px]
                text-[#8B672B]
                sm:inline-flex
              "
            >
              Pro
            </span>

          </div>


          <p
            className="
              mt-0.5
              hidden
              text-[8px]
              font-medium
              text-[#94A3B8]
              sm:block
            "
          >
            Manage courses, learners & your academy
          </p>

        </div>

      </div>


      {/* =================================================
          RIGHT — STATUS + PROFILE
      ================================================= */}

      <div className="flex items-center gap-3 sm:gap-5">

        {/* Portal Status */}

        <div
          className="
            hidden
            items-center
            gap-2
            rounded-full
            border
            border-[#E7E5E0]
            bg-[#FAF9F6]
            px-3
            py-2
            md:flex
          "
        >

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-500
              shadow-[0_0_8px_rgba(34,197,94,0.45)]
            "
          />

          <span
            className="
              text-[8px]
              font-black
              uppercase
              tracking-[0.9px]
              text-[#64748B]
            "
          >
            Studio Active
          </span>

        </div>


        {/* Divider */}

        <div
          className="
            hidden
            h-8
            w-px
            bg-[#E7E5E0]
            sm:block
          "
        />


        {/* Profile */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {user?.imageUrl ? (

            <img
              src={user.imageUrl}
              alt={educatorName}
              className="
                h-10
                w-10
                rounded-full
                object-cover
                ring-2
                ring-[#F5E8C8]
                ring-offset-1
              "
            />

          ) : (

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#0F172A]
                text-xs
                font-black
                text-[#D4AF6A]
                ring-2
                ring-[#F5E8C8]
                ring-offset-1
              "
            >
              {educatorName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((word) =>
                  word.charAt(0).toUpperCase()
                )
                .join("") || "E"}
            </div>

          )}


          <div className="hidden min-w-0 sm:block">

            <p
              className="
                max-w-[150px]
                truncate
                text-[11px]
                font-black
                text-[#0F172A]
              "
            >
              {educatorName}
            </p>

            <div
              className="
                mt-1
                flex
                items-center
                gap-1.5
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

              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.8px]
                  text-[#94A3B8]
                "
              >
                Educator
              </p>

            </div>

          </div>


          {/* Dropdown indicator */}

          <svg
            className="
              hidden
              text-[#94A3B8]
              sm:block
            "
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

        </div>

      </div>

    </nav>
  );
};

export default EducatorNavbar;