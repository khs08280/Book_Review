import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function Stars({ myRating, handleRating }: StarsProps) {
  const [hoveredStarIndex, setHoveredStarIndex] = useState(0);
  const [clickedStarIndex, setClickedStarIndex] = useState(0);
  useEffect(() => {
    if (myRating !== null && myRating !== undefined) {
      setClickedStarIndex(myRating);
      setHoveredStarIndex(myRating);
    }
  }, [myRating]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex">
        <span className="max-w-2">
          {hoveredStarIndex ? hoveredStarIndex : clickedStarIndex}
        </span>
      </div>
      <div className="flex">
        {[...Array(10)].map((_, index) => {
          const value = (index + 1) * 0.5;
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={value}
                className="hidden"
              />
              {Number.isInteger(value) ? (
                <button
                  style={{ transform: "rotateY(-180deg)" }}
                  className="w-4 overflow-hidden border-none bg-none"
                  onMouseEnter={() => setHoveredStarIndex(value)}
                  onMouseLeave={() => setHoveredStarIndex(0)}
                  onClick={() => {
                    handleRating(value);
                  }}
                >
                  <FaStar
                    className="size-8 cursor-pointer border-none transition-all duration-0"
                    color={
                      value <= (hoveredStarIndex || clickedStarIndex)
                        ? "#ffc107"
                        : "#e4e5e9"
                    }
                  />
                </button>
              ) : (
                <button
                  onMouseEnter={() => setHoveredStarIndex(value)}
                  onMouseLeave={() => setHoveredStarIndex(0)}
                  className="w-4 overflow-hidden border-none bg-none"
                  onClick={() => {
                    handleRating(value);
                  }}
                >
                  <FaStar
                    className="size-8 cursor-pointer border-none transition-all duration-0"
                    color={
                      value <= (hoveredStarIndex || clickedStarIndex)
                        ? "#ffc107"
                        : "#e4e5e9"
                    }
                  />
                </button>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
