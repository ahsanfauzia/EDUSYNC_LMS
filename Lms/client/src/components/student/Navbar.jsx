import React, {
  useContext,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useClerk,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import {
  AppContext,
} from "../../context/AppContext";

import {
  toast,
} from "react-toastify";

import axios from "axios";


const Navbar = () => {
  const {
    navigate,
    isEducator,
    backendUrl,
    setIsEducator,
    getToken,
  } = useContext(AppContext);

  const location = useLocation();

  const { openSignIn } = useClerk();

  const { user } = useUser();

  const [openMobile, setOpenMobile] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const isCourseListPage =
    location.pathname.includes("/course-list");

  const isHomePage =
    location.pathname === "/";

  const isEducatorPage =
    location.pathname.startsWith("/educator");


  // =====================================================
  // BECOME EDUCATOR
  // =====================================================

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator/dashboard");
        setOpenMobile(false);
        return;
      }

      if (!user) {
        openSignIn();
        return;
      }

      setIsLoading(true);

      const token = await getToken();

      if (!token) {
        openSignIn();
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setIsEducator(true);

        toast.success(
          data.message ||
            "You are now an educator."
        );

        setOpenMobile(false);

        navigate("/educator/dashboard");
      } else {
        toast.error(
          data.message ||
            "Unable to update educator role."
        );
      }
    } catch (error) {
      console.error(
        "Become Educator Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };


  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigation = (path) => {
    setOpenMobile(false);
    navigate(path);
  };


  return (
    <header
      className={`
        sticky
        top-0
        z-[100]
        w-full
        border-b
        backdrop-blur-xl
        transition-all
        duration-300

        ${
          isEducatorPage
            ? "border-white/10 bg-[#0F172A]/95"
            : "border-[#E7E5E0] bg-[#FAF9F6]/95"
        }
      `}
    >

      {/* Subtle gold top line */}
      <div
        className="
          absolute
          left-0
          top-0
          h-[2px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-[#D4AF6A]
          to-transparent
          opacity-70
        "
      />

      <div
        className="
          mx-auto
          flex
          h-[76px]
          w-full
          max-w-[1440px]
          items-center
          justify-between
          px-5
          sm:px-7
          lg:px-10
          xl:px-14
        "
      >

        {/* ================================================= */}
        {/* LOGO */}
        {/* ================================================= */}

        <button
          type="button"
          onClick={() =>
            handleNavigation("/")
          }
          className="
            group
            flex
            items-center
            gap-3
            outline-none
          "
        >

          {/* Logo Mark */}
          <div
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              overflow-hidden
              rounded-[13px]
              bg-[#0F172A]
              shadow-lg
              shadow-[#0F172A]/15
              transition-all
              duration-300
              group-hover:-translate-y-0.5
            "
          >

            <div
              className="
                absolute
                -right-4
                -top-4
                h-10
                w-10
                rounded-full
                bg-[#D4AF6A]/20
              "
            />

            <div
              className="
                absolute
                -bottom-5
                -left-5
                h-10
                w-10
                rounded-full
                bg-[#D4AF6A]/10
              "
            />

            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              className="
                relative
                z-10
              "
            >
              <path
                d="M12 3L21 7.5L12 12L3 7.5L12 3Z"
                stroke="#D4AF6A"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              <path
                d="M6 10.5V15.2C6 16.1 6.55 16.92 7.39 17.25L12 19L16.61 17.25C17.45 16.92 18 16.1 18 15.2V10.5"
                stroke="#FAF9F6"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M21 7.5V13"
                stroke="#D4AF6A"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>


          {/* Brand */}
          <div className="hidden sm:block text-left">

            <div
              className={`
                text-[20px]
                font-extrabold
                tracking-[-0.6px]

                ${
                  isEducatorPage
                    ? "text-white"
                    : "text-[#0F172A]"
                }
              `}
            >
              Edu
              <span className="text-[#B88A3B]">
                Sync
              </span>
            </div>

            <div
              className={`
                -mt-0.5
                text-[8px]
                font-bold
                uppercase
                tracking-[2.2px]

                ${
                  isEducatorPage
                    ? "text-white/40"
                    : "text-[#0F172A]/40"
                }
              `}
            >
              Learn. Grow. Lead.
            </div>

          </div>

        </button>


        {/* ================================================= */}
        {/* DESKTOP NAVIGATION */}
        {/* ================================================= */}

        {!isEducatorPage && (
          <nav
            className="
              hidden
              items-center
              gap-1
              md:flex
            "
          >

            <Link
              to="/"
              className={`
                relative
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-200

                ${
                  location.pathname === "/"
                    ? "text-[#0F172A]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }
              `}
            >
              Home

              {location.pathname === "/" && (
                <span
                  className="
                    absolute
                    bottom-0.5
                    left-1/2
                    h-0.5
                    w-5
                    -translate-x-1/2
                    rounded-full
                    bg-[#D4AF6A]
                  "
                />
              )}
            </Link>


            <Link
              to="/course-list"
              className={`
                relative
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-200

                ${
                  isCourseListPage
                    ? "text-[#0F172A]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }
              `}
            >
              Explore Courses

              {isCourseListPage && (
                <span
                  className="
                    absolute
                    bottom-0.5
                    left-1/2
                    h-0.5
                    w-5
                    -translate-x-1/2
                    rounded-full
                    bg-[#D4AF6A]
                  "
                />
              )}
            </Link>


            {user && (
              <Link
                to="/my-enrollments"
                className={`
                  relative
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200

                  ${
                    location.pathname ===
                    "/my-enrollments"
                      ? "text-[#0F172A]"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }
                `}
              >
                My Learning

                {location.pathname ===
                  "/my-enrollments" && (
                  <span
                    className="
                      absolute
                      bottom-0.5
                      left-1/2
                      h-0.5
                      w-5
                      -translate-x-1/2
                      rounded-full
                      bg-[#D4AF6A]
                    "
                  />
                )}
              </Link>
            )}

          </nav>
        )}


        {/* ================================================= */}
        {/* DESKTOP ACTIONS */}
        {/* ================================================= */}

        <div
          className="
            hidden
            items-center
            gap-3
            md:flex
          "
        >

          {!isEducatorPage && (
            <button
              type="button"
              onClick={becomeEducator}
              disabled={isLoading}
              className="
                group
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-[#D9D2C5]
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-[#334155]
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-[#D4AF6A]
                hover:bg-[#FDFBF5]
                hover:text-[#8B672B]
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-60
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
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />

                <path
                  d="M7 10V15.5C7 16.33 7.67 17 8.5 17H15.5C16.33 17 17 16.33 17 15.5V10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M20 7V13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              {isLoading
                ? "Please wait..."
                : isEducator
                  ? "Educator Dashboard"
                  : "Become Educator"}

            </button>
          )}


          {isEducatorPage && (
            <button
              type="button"
              onClick={() =>
                handleNavigation("/")
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white/80
                transition-all
                hover:border-[#D4AF6A]/40
                hover:bg-white/10
                hover:text-white
              "
            >

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 10.5L12 3L21 10.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M5.5 9.5V20H18.5V9.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />

                <path
                  d="M9.5 20V14H14.5V20"
                  stroke="#D4AF6A"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>

              Student View

            </button>
          )}


          {/* User */}
          {user ? (
            <div
              className={`
                flex
                items-center
                border-l
                pl-3

                ${
                  isEducatorPage
                    ? "border-white/10"
                    : "border-[#E7E5E0]"
                }
              `}
            >
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "h-10 w-10 rounded-xl ring-2 ring-[#D4AF6A]/20",
                  },
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                openSignIn()
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-[#0F172A]
                px-5
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-[#0F172A]/15
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#1B263B]
                hover:shadow-[#D4AF6A]/10
              "
            >
              Get Started

              <svg
                width="15"
                height="15"
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
          )}

        </div>


        {/* ================================================= */}
        {/* MOBILE */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-center
            gap-2
            md:hidden
          "
        >

          {user && (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "h-9 w-9 rounded-xl",
                },
              }}
            />
          )}


          {!user && (
            <button
              type="button"
              onClick={() =>
                openSignIn()
              }
              className="
                rounded-xl
                bg-[#0F172A]
                px-3.5
                py-2.5
                text-xs
                font-bold
                text-white
              "
            >
              Login
            </button>
          )}


          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() =>
              setOpenMobile(!openMobile)
            }
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border

              ${
                isEducatorPage
                  ? "border-white/10 bg-white/5 text-white"
                  : "border-[#E7E5E0] bg-white text-[#0F172A]"
              }
            `}
          >

            {openMobile ? (
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 7H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}

          </button>

        </div>

      </div>


      {/* ================================================= */}
      {/* MOBILE MENU */}
      {/* ================================================= */}

      {openMobile && (
        <div
          className={`
            border-t
            px-5
            pb-5
            pt-4
            shadow-xl
            md:hidden

            ${
              isEducatorPage
                ? "border-white/10 bg-[#0F172A]"
                : "border-[#E7E5E0] bg-[#FAF9F6]"
            }
          `}
        >

          <div
            className="
              mx-auto
              max-w-[1440px]
              space-y-2
            "
          >

            {!isEducatorPage && (
              <>

                <button
                  type="button"
                  onClick={() =>
                    handleNavigation("/")
                  }
                  className={`
                    flex
                    w-full
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-semibold

                    ${
                      location.pathname === "/"
                        ? "bg-[#0F172A] text-white"
                        : "text-[#334155] hover:bg-white"
                    }
                  `}
                >
                  Home
                </button>


                <button
                  type="button"
                  onClick={() =>
                    handleNavigation(
                      "/course-list"
                    )
                  }
                  className={`
                    flex
                    w-full
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-semibold

                    ${
                      isCourseListPage
                        ? "bg-[#0F172A] text-white"
                        : "text-[#334155] hover:bg-white"
                    }
                  `}
                >
                  Explore Courses
                </button>


                {user && (
                  <button
                    type="button"
                    onClick={() =>
                      handleNavigation(
                        "/my-enrollments"
                      )
                    }
                    className={`
                      flex
                      w-full
                      rounded-xl
                      px-4
                      py-3
                      text-left
                      text-sm
                      font-semibold

                      ${
                        location.pathname ===
                        "/my-enrollments"
                          ? "bg-[#0F172A] text-white"
                          : "text-[#334155] hover:bg-white"
                      }
                    `}
                  >
                    My Learning
                  </button>
                )}

              </>
            )}


            {!isEducatorPage && (
              <button
                type="button"
                onClick={becomeEducator}
                disabled={isLoading}
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-[#D4AF6A]/40
                  bg-[#F5E8C8]/40
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-bold
                  text-[#765522]
                  disabled:opacity-60
                "
              >

                <span>
                  {isLoading
                    ? "Please wait..."
                    : isEducator
                      ? "Educator Dashboard"
                      : "Become Educator"}
                </span>

                <svg
                  width="17"
                  height="17"
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
            )}


            {isEducatorPage && (
              <button
                type="button"
                onClick={() =>
                  handleNavigation("/")
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-bold
                  text-white
                "
              >
                Student View

                <svg
                  width="17"
                  height="17"
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
            )}

          </div>

        </div>
      )}

    </header>
  );
};


export default Navbar;