"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { formatDate } from "../hooks/checkDate";
import { maskUsername } from "../hooks/maskUsername";

function ReviewItem({
  review,
  userId,
  likeClick,
  isLikeClicked,
  reviewLikes,
  accessToken,
  bookId,
  isUserReview,
  handleUpdateReview,
  myRating,
}: any) {
  const queryClient = useQueryClient();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "DELETE",
        body: JSON.stringify({ reviewId: review._id }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
        credentials: "include",
      });
      if (!response.ok) {
        console.log(response.json());
        throw new Error("Network response was not ok");
      }
    },
    onError: (error) => {
      console.error("Review creation error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });

  const menuOpenClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const deleteReview = () => {
    deleteMutation.mutate();
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li className="mb-5 flex h-28 flex-col justify-between border-b border-solid border-slate-400 pb-4">
      {isUserReview ? (
        <div className="flex">
          {myRating !== null &&
            [...Array(10)].map((_, index) => {
              const value = (index + 1.0) * 0.5;
              return (
                <React.Fragment key={index}>
                  {Number.isInteger(value) ? (
                    <button
                      style={{ transform: "rotateY(-180deg)" }}
                      className="w-2 cursor-auto overflow-hidden border-none bg-none"
                    >
                      <FaStar
                        className="size-4 border-none transition-all duration-0"
                        color={value <= myRating ? "#ffc107" : "#e4e5e9"}
                      />
                    </button>
                  ) : (
                    <button
                      key={index}
                      className="w-2 cursor-auto overflow-hidden border-none bg-none"
                    >
                      <FaStar
                        className="size-4 border-none transition-all duration-0"
                        color={value <= myRating ? "#ffc107" : "#e4e5e9"}
                      />
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          <span className="ml-2">{myRating}</span>
        </div>
      ) : null}
      <div className="flex w-full justify-between">
        <div>
          <span className="mr-5">{formatDate(review.createdAt)}</span>
          {isUserReview ? (
            <span className=" rounded-md bg-slate-200 px-2 py-1">내 리뷰</span>
          ) : null}
        </div>
        <div>
          {review?.author.nickname}({maskUsername(review?.author.username)})
        </div>
      </div>
      <div>{review.content}</div>
      <div className="relative flex justify-between">
        <div className="flex items-center">
          {isLikeClicked[review._id] ? (
            <AiFillLike
              onClick={() => likeClick(review._id)}
              className="mr-2 size-5 cursor-pointer"
            />
          ) : (
            <AiOutlineLike
              onClick={() => likeClick(review._id)}
              className="mr-2 size-5 cursor-pointer"
            />
          )}
          <span>{reviewLikes[review._id]}</span>
        </div>
        {review.author._id === userId ? (
          <CiMenuKebab
            onClick={menuOpenClick}
            className="size-5 cursor-pointer"
          />
        ) : null}

        {isMenuOpen ? (
          <div
            ref={menuRef}
            className="absolute -bottom-28 right-0 z-30 flex w-40 flex-col rounded-md bg-light-light py-2"
          >
            <span
              onClick={() => handleUpdateReview(review)}
              className="mb-1 cursor-pointer px-2 py-3 transition-all hover:bg-slate-300"
            >
              수정
            </span>
            <span
              onClick={deleteReview}
              className="cursor-pointer px-2 py-3 transition-all hover:bg-slate-300"
            >
              삭제
            </span>
          </div>
        ) : null}
      </div>
    </li>
  );
}

export default ReviewItem;
