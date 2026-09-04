import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white">

      <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8">

        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-[#E7E5E0]
            pt-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-[#0F172A]
                text-[9px]
                font-black
                text-[#D4AF6A]
              "
            >
              ES
            </div>

            <div>

              <p
                className="
                  text-[10px]
                  font-black
                  text-[#0F172A]
                "
              >
                EduSync Academy
              </p>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  font-medium
                  text-[#94A3B8]
                "
              >
                Empowering educators to create better learning.
              </p>

            </div>

          </div>


          {/* RIGHT */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
              text-[8px]
              font-bold
              text-[#94A3B8]
            "
          >

            <span>
              © {new Date().getFullYear()} EduSync
            </span>

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

            <span className="text-[#B88A3B]">
              Teach. Inspire. Grow.
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;