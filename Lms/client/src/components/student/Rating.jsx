import React from "react";

const Rating = ({ initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = React.useState(initialRating);
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleRating = (value) => {
    setRating(value);

    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">

      {[1, 2, 3, 4, 5].map((star) => {
        const activeRating = hoverRating || rating;
        const isActive = star <= activeRating;

        return (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} out of 5`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="
              group
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              transition-all
              duration-150
              hover:bg-[#F5E8C8]
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isActive ? "#D4AF6A" : "none"}
              stroke={isActive ? "#D4AF6A" : "#CBD5E1"}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="
                transition-transform
                duration-150
                group-hover:scale-110
              "
            >
              <path d="M12 3.8L14.6 9.1L20.5 9.9L16.25 14L17.2 19.8L12 17.05L6.8 19.8L7.75 14L3.5 9.9L9.4 9.1L12 3.8Z" />
            </svg>
          </button>
        );
      })}

    </div>
  );
};

export default Rating;