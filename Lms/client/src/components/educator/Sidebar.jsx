import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AppContext } from "../../context/AppContext";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  if (!isEducator) return null;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/educator/dashboard",
      short: "DB",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            x="4"
            y="4"
            width="6"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <rect
            x="14"
            y="4"
            width="6"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <rect
            x="4"
            y="14"
            width="6"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <rect
            x="14"
            y="14"
            width="6"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.7"
          />
        </svg>
      ),
    },

    {
      name: "My Courses",
      path: "/educator/my-courses",
      short: "MC",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 4.5C5 3.67 5.67 3 6.5 3H18.5C19.33 3 20 3.67 20 4.5V19.5C20 20.33 19.33 21 18.5 21H6.5C5.67 21 5 20.33 5 19.5V4.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M8 7H17"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M8 11H17"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M8 15H13"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      name: "Add Course",
      path: "/educator/add-course",
      short: "AC",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M12 8V16"
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
      ),
    },

    {
      name: "Students Enrolled",
      path: "/educator/student-enrolled",
      short: "SE",
      icon: (
        <svg
          width="18"
          height="18"
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
      ),
    },
  ];

  return (
    <aside
      className="
        sticky
        top-0
        flex
        h-screen
        w-[250px]
        shrink-0
        flex-col
        overflow-hidden
        bg-[#0F172A]
        text-white
      "
    >

      {/* =================================================
          BRAND
      ================================================= */}

      <div
        className="
          relative
          border-b
          border-white/10
          px-6
          py-6
        "
      >

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

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#D4AF6A]
              text-sm
              font-black
              tracking-tight
              text-[#0F172A]
            "
          >
            ES
          </div>

          <div className="min-w-0">

            <p
              className="
                truncate
                text-sm
                font-black
                tracking-tight
                text-white
              "
            >
              EduSync
            </p>

            <p
              className="
                mt-0.5
                text-[8px]
                font-bold
                uppercase
                tracking-[1.5px]
                text-[#D4AF6A]
              "
            >
              Educator Studio
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="flex-1 overflow-y-auto px-4 py-6">

        <p
          className="
            mb-3
            px-3
            text-[8px]
            font-black
            uppercase
            tracking-[1.8px]
            text-[#64748B]
          "
        >
          Workspace
        </p>


        <nav className="space-y-1.5">

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                  group
                  relative
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-[#94A3B8] hover:bg-white/[0.05] hover:text-white"
                  }
                `
              }
            >
              {({ isActive }) => (
                <>

                  {/* Active Indicator */}

                  <span
                    className={`
                      absolute
                      left-0
                      h-7
                      w-[3px]
                      rounded-r-full
                      bg-[#D4AF6A]
                      transition-opacity
                      ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0"
                      }
                    `}
                  />


                  {/* Icon */}

                  <span
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition-all
                      ${
                        isActive
                          ? "bg-[#D4AF6A]/15 text-[#D4AF6A]"
                          : "bg-white/[0.03] text-[#64748B] group-hover:text-[#D4AF6A]"
                      }
                    `}
                  >
                    {item.icon}
                  </span>


                  {/* Label */}

                  <span
                    className={`
                      text-[11px]
                      font-bold
                      ${
                        isActive
                          ? "text-white"
                          : "text-[#94A3B8] group-hover:text-white"
                      }
                    `}
                  >
                    {item.name}
                  </span>


                  {/* Active Arrow */}

                  {isActive && (
                    <svg
                      className="
                        ml-auto
                        text-[#D4AF6A]
                      "
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}

                </>
              )}
            </NavLink>

          ))}

        </nav>


        {/* =================================================
            QUICK INFO
        ================================================= */}

        <div
          className="
            mt-8
            rounded-2xl
            border
            border-[#D4AF6A]/15
            bg-[#D4AF6A]/5
            p-4
          "
        >

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-[#D4AF6A]/10
              text-[#D4AF6A]
            "
          >

            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 3L14.5 8.5L20.5 9L16 13L17.5 19L12 16L6.5 19L8 13L3.5 9L9.5 8.5L12 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

          </div>


          <p
            className="
              mt-3
              text-[10px]
              font-black
              text-white
            "
          >
            Teach. Inspire. Grow.
          </p>

          <p
            className="
              mt-1.5
              text-[8px]
              leading-4
              text-[#94A3B8]
            "
          >
            Build meaningful learning
            experiences for your students.
          </p>

        </div>

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div
        className="
          border-t
          border-white/10
          px-5
          py-4
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div>

            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[1px]
                text-[#64748B]
              "
            >
              Educator Portal
            </p>

            <p
              className="
                mt-1
                text-[9px]
                font-bold
                text-[#94A3B8]
              "
            >
              EduSync Academy
            </p>

          </div>


          <span
            className="
              h-2
              w-2
              rounded-full
              bg-emerald-400
              shadow-[0_0_10px_rgba(52,211,153,0.5)]
            "
            title="Portal active"
          />

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;