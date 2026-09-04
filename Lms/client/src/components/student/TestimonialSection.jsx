import React from "react";

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Aanya Sharma",
      role: "B.Tech CSE Student",
      feedback:
        "EduSync helped me understand complex topics very easily. The UI, courses, and quizzes are amazing!",
      image:
        "https://img.freepik.com/free-photo/portrait-happy-pretty-girl_144627-15108.jpg",
      rating: 5,
    },
    {
      name: "Rohan Verma",
      role: "Engineering Student",
      feedback:
        "The best learning platform! The content quality is outstanding and very student-friendly.",
      image:
        "https://img.freepik.com/free-photo/portrait-handsome-young-man_144627-14154.jpg",
      rating: 4,
    },
    {
      name: "Sara Malik",
      role: "Student",
      feedback:
        "I improved my grades with EduSync. The quizzes and notes helped me a lot!",
      image:
        "https://img.freepik.com/free-photo/close-up-woman-smiling_23-2149174244.jpg",
      rating: 5,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20">

      {/* ================================================= */}
      {/* BACKGROUND DECORATION */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-10
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
          -right-40
          bottom-0
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

        <div className="mx-auto max-w-[700px] text-center">

          <div
            className="
              mb-4
              flex
              items-center
              justify-center
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
              Learner Stories
            </span>

            <span
              className="
                h-px
                w-10
                bg-[#D4AF6A]
              "
            />

          </div>


          <h2
            className="
              text-3xl
              font-black
              tracking-[-1px]
              text-[#0F172A]
              sm:text-4xl
              lg:text-[42px]
            "
          >
            Learning that makes a
            <span className="text-[#B88A3B]">
              {" "}difference.
            </span>
          </h2>


          <p
            className="
              mt-4
              text-sm
              leading-6
              text-[#64748B]
              sm:text-base
            "
          >
            Hear from learners who are using EduSync to
            build knowledge, improve their skills, and move
            closer to their goals.
          </p>

        </div>


        {/* ================================================= */}
        {/* TESTIMONIAL GRID */}
        {/* ================================================= */}

        <div
          className="
            mt-12
            grid
            grid-cols-1
            gap-6
            md:grid-cols-3
          "
        >

          {testimonials.map((t, index) => (
            <article
              key={index}
              className="
                group
                relative
                flex
                min-h-[300px]
                flex-col
                rounded-3xl
                border
                border-[#E7E5E0]
                bg-[#FAF9F6]
                p-7
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#D4AF6A]/40
                hover:bg-white
                hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)]
              "
            >

              {/* Quote icon */}

              <div
                className="
                  absolute
                  right-6
                  top-5
                  text-[58px]
                  font-serif
                  font-black
                  leading-none
                  text-[#D4AF6A]/20
                  transition-colors
                  duration-300
                  group-hover:text-[#D4AF6A]/35
                "
              >
                “
              </div>


              {/* ================================================= */}
              {/* USER */}
              {/* ================================================= */}

              <div
                className="
                  relative
                  z-10
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    h-14
                    w-14
                    shrink-0
                    overflow-hidden
                    rounded-2xl
                    border-2
                    border-white
                    bg-[#E7E5E0]
                    shadow-[0_5px_15px_rgba(15,23,42,0.08)]
                  "
                >

                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                </div>


                <div>

                  <h3
                    className="
                      text-sm
                      font-extrabold
                      text-[#0F172A]
                    "
                  >
                    {t.name}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      font-medium
                      text-[#94A3B8]
                    "
                  >
                    {t.role}
                  </p>

                </div>

              </div>


              {/* ================================================= */}
              {/* RATING */}
              {/* ================================================= */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                "
              >

                <div className="flex items-center gap-0.5">

                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 20 20"
                      className={`
                        h-4
                        w-4
                        ${
                          i < t.rating
                            ? "fill-[#D4AF6A]"
                            : "fill-[#DDE2E8]"
                        }
                      `}
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
                    </svg>
                  ))}

                </div>


                <span
                  className="
                    rounded-full
                    border
                    border-[#E7E5E0]
                    bg-white
                    px-2.5
                    py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[1px]
                    text-[#8B672B]
                  "
                >
                  Verified Learner
                </span>

              </div>


              {/* Divider */}

              <div
                className="
                  my-5
                  h-px
                  bg-[#E7E5E0]
                "
              />


              {/* ================================================= */}
              {/* FEEDBACK */}
              {/* ================================================= */}

              <p
                className="
                  flex-1
                  text-sm
                  font-medium
                  leading-7
                  text-[#475569]
                "
              >
                “{t.feedback}”
              </p>


              {/* Bottom accent */}

              <div
                className="
                  mt-6
                  h-1
                  w-10
                  rounded-full
                  bg-[#D4AF6A]
                  transition-all
                  duration-300
                  group-hover:w-16
                "
              />

            </article>
          ))}

        </div>


        {/* ================================================= */}
        {/* TRUST SUMMARY */}
        {/* ================================================= */}

        <div
          className="
            mx-auto
            mt-12
            flex
            max-w-[800px]
            flex-col
            items-center
            justify-center
            gap-6
            rounded-3xl
            border
            border-[#E7E5E0]
            bg-[#FAF9F6]
            px-6
            py-6
            sm:flex-row
            sm:gap-10
          "
        >

          {/* Rating */}

          <div className="text-center">

            <div
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
                  text-[#D4AF6A]
                "
              >
                ★
              </span>
            </div>

            <p
              className="
                mt-1
                text-[9px]
                font-bold
                uppercase
                tracking-[1.5px]
                text-[#94A3B8]
              "
            >
              Learner Rating
            </p>

          </div>


          <div
            className="
              hidden
              h-10
              w-px
              bg-[#E7E5E0]
              sm:block
            "
          />


          {/* Learning */}

          <div className="text-center">

            <div
              className="
                text-2xl
                font-black
                text-[#0F172A]
              "
            >
              100%
            </div>

            <p
              className="
                mt-1
                text-[9px]
                font-bold
                uppercase
                tracking-[1.5px]
                text-[#94A3B8]
              "
            >
              Practical Focus
            </p>

          </div>


          <div
            className="
              hidden
              h-10
              w-px
              bg-[#E7E5E0]
              sm:block
            "
          />


          {/* Experience */}

          <div className="text-center">

            <div
              className="
                text-2xl
                font-black
                text-[#0F172A]
              "
            >
              Student
            </div>

            <p
              className="
                mt-1
                text-[9px]
                font-bold
                uppercase
                tracking-[1.5px]
                text-[#94A3B8]
              "
            >
              First Experience
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default TestimonialSection;