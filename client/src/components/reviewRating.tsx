import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

interface IReviewRating {
  myRating: number | null;
}

function ReviewRating({ myRating }: IReviewRating) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (myRating !== null && myRating !== undefined) {
      setRating(myRating);
    }
  }, [myRating]);

  return (
    <div className="flex items-center justify-center">
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
                    color={value <= rating ? "#ffc107" : "#e4e5e9"}
                  />
                </button>
              ) : (
                <button className="w-4 cursor-auto overflow-hidden border-none bg-none">
                  <FaStar
                    className="size-8 border-none transition-all duration-0"
                    color={value <= rating ? "#ffc107" : "#e4e5e9"}
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
export default ReviewRating;
