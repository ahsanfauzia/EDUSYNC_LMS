import React, { useState } from "react";

const SearchBar = ({ onSearch, initialValue = "" }) => {
  const [searchValue, setSearchValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchValue.trim());
    }
  };

  const handleClear = () => {
    setSearchValue("");

    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex
        w-full
        items-center
        gap-2
        rounded-2xl
        border
        border-[#E7E5E0]
        bg-white
        p-1.5
        shadow-[0_8px_30px_rgba(15,23,42,0.05)]
        transition-all
        duration-200
        focus-within:border-[#D4AF6A]
        focus-within:shadow-[0_8px_30px_rgba(212,175,106,0.12)]
      "
    >

      {/* Search Icon */}

      <div
        className="
          ml-2
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-[#FAF9F6]
          text-[#64748B]
        "
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M16 16L20.5 20.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>


      {/* Input */}

      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search courses, skills or topics..."
        className="
          min-w-0
          flex-1
          bg-transparent
          px-2
          py-2.5
          text-[11px]
          font-medium
          text-[#171717]
          outline-none
          placeholder:text-[#94A3B8]
        "
      />


      {/* Clear */}

      {searchValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-[#94A3B8]
            transition-colors
            hover:bg-[#FAF9F6]
            hover:text-[#0F172A]
          "
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}


      {/* Search Button */}

      <button
        type="submit"
        className="
          flex
          h-10
          shrink-0
          items-center
          gap-2
          rounded-xl
          bg-[#0F172A]
          px-4
          text-[10px]
          font-black
          text-white
          transition-all
          duration-200
          hover:bg-[#17233D]
          active:scale-[0.98]
          sm:px-5
        "
      >
        <span>Search</span>

        <svg
          width="13"
          height="13"
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

    </form>
  );
};

export default SearchBar;