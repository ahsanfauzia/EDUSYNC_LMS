
import React from "react";

const Loading = () => {
  return (
    <div
      className="
        flex
        min-h-[55vh]
        w-full
        items-center
        justify-center
        bg-[#FAF9F6]
        px-6
      "
    >
      <div className="flex flex-col items-center text-center">

        {/* Spinner */}
        <div className="relative h-14 w-14">

          <div
            className="
              absolute
              inset-0
              rounded-full
              border-[3px]
              border-[#E7E5E0]
            "
          />

          <div
            className="
              absolute
              inset-0
              animate-spin
              rounded-full
              border-[3px]
              border-transparent
              border-t-[#D4AF6A]
            "
          />

          <div
            className="
              absolute
              inset-[11px]
              rounded-full
              bg-[#0F172A]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-1.5
              w-1.5
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#D4AF6A]
            "
          />

        </div>

        {/* Text */}
        <p
          className="
            mt-5
            text-sm
            font-black
            tracking-tight
            text-[#0F172A]
          "
        >
          Preparing your learning experience
        </p>

        <p
          className="
            mt-1.5
            text-[10px]
            font-medium
            text-[#94A3B8]
          "
        >
          Please wait a moment...
        </p>

      </div>
    </div>
  );
};

export default Loading;