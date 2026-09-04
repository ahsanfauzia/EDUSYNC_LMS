import React from "react";

const Companies = () => {
  const companies = [
    {
      name: "Microsoft",
      logo: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
    },
    {
      name: "Walmart",
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    },
    {
      name: "Adobe",
      logo: "https://cdn-icons-png.flaticon.com/512/732/732228.png",
    },
    {
      name: "Accenture",
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968866.png",
    },
    {
      name: "PayPal",
      logo: "https://cdn-icons-png.flaticon.com/512/196/196565.png",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white">

      {/* Soft decorative glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-32
          w-96
          -translate-x-1/2
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
          py-12
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="text-center">

          <div
            className="
              mx-auto
              mb-3
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
                bg-[#D4AF6A]/50
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
              Trusted Learning
            </span>

            <span
              className="
                h-px
                w-10
                bg-[#D4AF6A]/50
              "
            />

          </div>

          <p
            className="
              text-sm
              font-medium
              text-[#64748B]
              sm:text-base
            "
          >
            Trusted by learners building careers at
          </p>

        </div>


        {/* ================================================= */}
        {/* COMPANY LOGOS */}
        {/* ================================================= */}

        <div
          className="
            mt-8
            grid
            grid-cols-2
            items-center
            gap-3
            sm:grid-cols-3
            md:grid-cols-5
            md:gap-5
          "
        >

          {companies.map((company) => (
            <div
              key={company.name}
              className="
                group
                flex
                h-[82px]
                items-center
                justify-center
                rounded-2xl
                border
                border-[#E7E5E0]
                bg-[#FAF9F6]
                px-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#D4AF6A]/40
                hover:bg-white
                hover:shadow-[0_15px_35px_rgba(15,23,42,0.07)]
              "
            >

              <img
                src={company.logo}
                alt={`${company.name} logo`}
                loading="lazy"
                className="
                  h-9
                  w-auto
                  max-w-[90px]
                  object-contain
                  grayscale
                  opacity-50
                  transition-all
                  duration-300
                  group-hover:grayscale-0
                  group-hover:opacity-90
                  md:h-11
                  md:max-w-[105px]
                "
              />

            </div>
          ))}

        </div>


        {/* ================================================= */}
        {/* TRUST FOOTER */}
        {/* ================================================= */}

        <div
          className="
            mt-8
            flex
            flex-wrap
            items-center
            justify-center
            gap-x-6
            gap-y-3
            text-[11px]
            font-semibold
            text-[#94A3B8]
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
                text-[10px]
                font-black
                text-[#8B672B]
              "
            >
              ✓
            </span>

            Industry-focused learning

          </div>


          <span
            className="
              hidden
              h-1
              w-1
              rounded-full
              bg-[#D4AF6A]
              sm:block
            "
          />


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
                text-[10px]
                font-black
                text-[#8B672B]
              "
            >
              ✓
            </span>

            Practical career skills

          </div>


          <span
            className="
              hidden
              h-1
              w-1
              rounded-full
              bg-[#D4AF6A]
              sm:block
            "
          />


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
                text-[10px]
                font-black
                text-[#8B672B]
              "
            >
              ✓
            </span>

            Learn at your own pace

          </div>

        </div>

      </div>

    </section>
  );
};

export default Companies;