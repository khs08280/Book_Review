import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function AverageStars({
  averageRating,
  ratingCount,
}: AverageStarsProps) {
  const [clickedStarIndex, setClickedStarIndex] = useState(0);

  useEffect(() => {
    if (averageRating !== null && averageRating !== undefined) {
      setClickedStarIndex(averageRating);
    }
  }, [averageRating, ratingCount]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex">
        <span className="text-2xl">{clickedStarIndex.toFixed(1)}</span>
      </div>
      <span className="my-1 text-sm">{ratingCount}개의 별점</span>
      <div className="flex">
        {[...Array(10)].map((_, index) => {
          const value = (index + 1.0) * 0.5;
          return (
            <>
              {Number.isInteger(value) ? (
                <button
                  style={{ transform: "rotateY(-180deg)" }}
                  className="w-4 cursor-auto overflow-hidden border-none bg-none"
                >
                  <FaStar
                    className="size-8 border-none transition-all duration-0"
                    color={value <= clickedStarIndex ? "#ffc107" : "#e4e5e9"}
                  />
                </button>
              ) : (
                <button className="w-4 cursor-auto overflow-hidden border-none bg-none">
                  <FaStar
                    className="size-8 border-none transition-all duration-0"
                    color={value <= clickedStarIndex ? "#ffc107" : "#e4e5e9"}
                  />
                </button>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}
