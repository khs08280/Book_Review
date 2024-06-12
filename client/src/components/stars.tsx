import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function Stars({ myRating, handleRating }: StarsProps) {
  const [hoveredStarIndex, setHoveredStarIndex] = useState(0);
  const [clickedStarIndex, setClickedStarIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    if (myRating !== null && myRating !== undefined) {
      setClickedStarIndex(myRating);
      setHoveredStarIndex(myRating);
    }
  }, [myRating]);

  const updateText = (value: number) => {
    if (value == 0) {
      setText("별점을 남겨주세요!");
    } else if (value == 0.5) {
      setText("읽은 시간이 아까워요..");
    } else if (value == 1) {
      setText("다시는 읽고 싶지 않아요");
    } else if (value == 1.5) {
      setText("별로예요");
    } else if (value == 2) {
      setText("뭔가 아쉬운 책이에요");
    } else if (value == 2.5) {
      setText("평범한 정도예요");
    } else if (value == 3.0) {
      setText("볼만해요");
    } else if (value == 3.5) {
      setText("재미있게 봤어요");
    } else if (value == 4.0) {
      setText("보면 절대 후회 안 해요!");
    } else if (value == 4.5) {
      setText("강추! 꼭 보세요!");
    } else {
      setText("내 인생작! 안 보면 손해예요!!");
    }
  };
  useEffect(() => {
    updateText(hoveredStarIndex);
  }, [hoveredStarIndex]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex">
        <span className="text-xl">
          {hoveredStarIndex
            ? hoveredStarIndex.toFixed(1)
            : clickedStarIndex.toFixed(1)}
        </span>
      </div>
      <span className="text-lg">{text}</span>
      <div className="flex">
        {[...Array(10)].map((_, index) => {
          const value = (index + 1.0) * 0.5;
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
                  className="w-2 overflow-hidden border-none bg-none sm:w-3 lg:w-4"
                  onMouseEnter={() => setHoveredStarIndex(value)}
                  onMouseLeave={() => setHoveredStarIndex(clickedStarIndex)}
                  onClick={() => {
                    setClickedStarIndex(value);
                    handleRating(value);
                  }}
                >
                  <FaStar
                    className="size-4 cursor-pointer border-none transition-all duration-0 sm:size-6 lg:size-8"
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
                  onMouseLeave={() => setHoveredStarIndex(clickedStarIndex)}
                  className="w-2 overflow-hidden border-none bg-none sm:w-3 lg:w-4"
                  onClick={() => {
                    setClickedStarIndex(value);
                    handleRating(value);
                  }}
                >
                  <FaStar
                    className="size-4 cursor-pointer border-none transition-all duration-0 sm:size-6 lg:size-8"
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
