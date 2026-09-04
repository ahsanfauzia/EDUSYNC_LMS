import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { calculateRating, currency } = useContext(AppContext);
  const navigate = useNavigate();

  const rating = calculateRating(course);

  const finalPrice = (
    course.coursePrice -
    (course.discount * course.coursePrice) / 100
  ).toFixed(2);

  const handleViewCourse = () => {
    navigate(`/course/${course._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-[#E7E5E0]
        bg-white
        shadow-[0_8px_25px_rgba(15,23,42,0.05)]
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-[#D4AF6A]/40
        hover:shadow-[0_20px_45px_rgba(15,23,42,0.11)]
      "
    >

      {/* ================================================= */}
      {/* THUMBNAIL */}
      {/* ================================================= */}

      <div
        className="
          relative
          h-48
          w-full
          overflow-hidden
          bg-[#E7E5E0]
        "
      >

        <img
          src={course.courseThumbnail}
          alt={course.courseTitle}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />


        {/* Image overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#0F172A]/45
            via-transparent
            to-transparent
            opacity-60
          "
        />


        {/* Discount badge */}

        {course.discount > 0 && (
          <div
            className="
              absolute
              left-3
              top-3
              rounded-lg
              bg-[#0F172A]
              px-3
              py-1.5
              text-[10px]
              font-black
              uppercase
              tracking-[1px]
              text-[#D4AF6A]
              shadow-lg
            "
          >
            {Math.round(course.discount)}% Off
          </div>
        )}


        {/* Course badge */}

        <div
          className="
            absolute
            bottom-3
            left-3
            rounded-lg
            border
            border-white/20
            bg-white/90
            px-2.5
            py-1
            text-[9px]
            font-bold
            uppercase
            tracking-[1px]
            text-[#0F172A]
            backdrop-blur-sm
          "
        >
          Online Course
        </div>

      </div>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-1
          flex-col
          p-5
        "
      >

        {/* Title */}

        <h3
          className="
            line-clamp-2
            min-h-[52px]
            text-[17px]
            font-extrabold
            leading-[1.5]
            tracking-[-0.2px]
            text-[#0F172A]
            transition-colors
            duration-200
            group-hover:text-[#8B672B]
          "
        >
          {course.courseTitle}
        </h3>


        {/* Description */}

        <p
          className="
            mt-2.5
            line-clamp-2
            min-h-[42px]
            text-[12px]
            leading-5
            text-[#64748B]
          "
        >
          {course.courseDescription}
        </p>


        {/* ================================================= */}
        {/* RATING */}
        {/* ================================================= */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-2
          "
        >

          <span
            className="
              text-sm
              font-black
              text-[#8B672B]
            "
          >
            {rating.toFixed(1)}
          </span>


          <div
            className="
              flex
              items-center
              gap-0.5
            "
          >

            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 20 20"
                className={`
                  h-3.5
                  w-3.5
                  ${
                    i < Math.round(rating)
                      ? "fill-[#D4AF6A]"
                      : "fill-[#E2E8F0]"
                  }
                `}
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
              </svg>
            ))}

          </div>


          <span
            className="
              text-[10px]
              font-medium
              text-[#94A3B8]
            "
          >
            Course rating
          </span>

        </div>


        {/* Divider */}

        <div
          className="
            my-4
            h-px
            bg-[#E7E5E0]
          "
        />


        {/* ================================================= */}
        {/* PRICE */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-end
            justify-between
            gap-3
          "
        >

          <div>

            <p
              className="
                mb-1
                text-[9px]
                font-bold
                uppercase
                tracking-[1.2px]
                text-[#94A3B8]
              "
            >
              Course Price
            </p>

            <div
              className="
                flex
                items-baseline
                gap-2
              "
            >

              <span
                className="
                  text-xl
                  font-black
                  tracking-[-0.5px]
                  text-[#0F172A]
                "
              >
                {currency}
                {finalPrice}
              </span>


              {course.discount > 0 && (
                <span
                  className="
                    text-xs
                    font-medium
                    text-[#94A3B8]
                    line-through
                  "
                >
                  {currency}
                  {course.coursePrice}
                </span>
              )}

            </div>

          </div>


          {/* Small arrow */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#F5E8C8]
              text-[#8B672B]
              transition-all
              duration-200
              group-hover:bg-[#D4AF6A]
              group-hover:text-[#0F172A]
            "
          >

            <svg
              width="16"
              height="16"
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

          </div>

        </div>


        {/* ================================================= */}
        {/* CTA */}
        {/* ================================================= */}

        <button
          onClick={handleViewCourse}
          className="
            mt-5
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#0F172A]
            text-xs
            font-bold
            text-white
            transition-all
            duration-200
            hover:bg-[#1B263B]
            hover:shadow-[0_10px_25px_rgba(15,23,42,0.16)]
            active:scale-[0.98]
          "
        >
          View Course

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

      </div>

    </article>
  );
};

export default CourseCard;