import { useQuery } from "@tanstack/react-query";
import React, { LiHTMLAttributes, useEffect, useRef, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import LocalStorage from "../hooks/localStorage";
import { getUserId, isExpired } from "../hooks/isExpired";
import { useRouter } from "next/navigation";

function Modal({ isOpen, onClose, bookId }: any) {
  const [isReviewActive, setIsReviewActive] = useState(false);
  const [reviewLikes, setReviewLikes] = useState<{ [key: string]: number }>({});

  const [isLikeClicked, setIsLikeClicked] = useState<{
    [key: string]: boolean;
  }>({});
  const [userId, setUserId] = useState<string | null>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  let accessToken = LocalStorage.getItem("accessToken");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMillis = now.getTime() - date.getTime();

    const millisInSecond = 1000;
    const millisInMinute = millisInSecond * 60;
    const millisInHour = millisInMinute * 60;
    const millisInDay = millisInHour * 24;
    const millisInMonth = millisInDay * 30; // 간단한 계산으로 사용하며 정확하지 않을 수 있습니다.
    const millisInYear = millisInDay * 365; // 간단한 계산으로 사용하며 정확하지 않을 수 있습니다.

    if (diffMillis < millisInMinute) {
      return "방금 전";
    } else if (diffMillis < millisInHour) {
      const minutes = Math.floor(diffMillis / millisInMinute);
      return `${minutes}분 전`;
    } else if (diffMillis < millisInDay) {
      const hours = Math.floor(diffMillis / millisInHour);
      return `${hours}시간 전`;
    } else if (diffMillis < millisInMonth) {
      const days = Math.floor(diffMillis / millisInDay);
      return `${days}일 전`;
    } else if (diffMillis < millisInYear) {
      const months = Math.floor(diffMillis / millisInMonth);
      return `${months}개월 전`;
    } else {
      const years = Math.floor(diffMillis / millisInYear);
      return `${years}년 전`;
    }
  };

  const maskUsername = (username: string) => {
    if (!username) return "";
    const visiblePart = username.substring(0, 3);
    const maskedPart = "*".repeat(username.length - 3);
    return visiblePart + maskedPart;
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data.data);
      return data.data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };
  const { data: book, isLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: fetchData,
  });
  const inputActiveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsReviewActive(true);
  };
  const falseActiveClick = () => {
    setIsReviewActive(false);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setIsReviewActive(false);
      }
    };
    const fetchData = async () => {
      const useId = await getUserId(accessToken);
      setUserId(useId);
    };
    fetchData();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen || isLoading || !book) {
    return null;
  }
  const likeClick = async (reviewId: string) => {
    const expired = await isExpired(accessToken);
    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      return;
    }
    accessToken = LocalStorage.getItem("accessToken");
    try {
      const response = await fetch(
        "http://localhost:5000/api/reviews/handleLike",
        {
          method: "POST",
          body: JSON.stringify({ reviewId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          mode: "cors",
          credentials: "include",
        },
      );
      if (response.status === 200) {
        const responseData = await response.json();
        setIsLikeClicked((prevState) => ({
          ...prevState,
          [reviewId]: !prevState[reviewId],
        }));
        setReviewLikes((prevState) => ({
          ...prevState,
          [reviewId]: responseData.likes,
        }));
        console.log(responseData);
      } else if (response.status === 403) {
        console.error("로그인이 필요합니다");
        router.push("/login");
      }
    } catch (error) {
      console.error("좋아요 오류:", error);
      throw error;
    }
  };

  return (
    <div
      onClick={falseActiveClick}
      className="fixed inset-0 z-10  bg-black bg-opacity-30"
    >
      <div className="flex h-screen items-center justify-center">
        <div
          onClick={handleModalClick}
          className=" relative h-4/5 w-7/12 overflow-y-auto rounded-lg bg-white p-10 shadow-lg"
        >
          <div className="absolute right-3 top-3 ">
            <button onClick={onClose}>
              <IoClose className="size-8" />
            </button>
          </div>
          <div
            className={`mb-7 h-2/3 place-content-center bg-cover bg-center`}
            style={{ backgroundImage: `url(${book.image})` }}
          >
            <div className="z-30 flex items-center justify-between ">
              <div className="flex flex-col ">
                <div className="mb-1 flex w-fit items-center rounded-md bg-slate-500 px-1 text-lg font-semibold">
                  <FaStar className="mr-2 " style={{ flexShrink: 0 }} />
                  <span>{book.rating}</span>
                </div>
                <span className="mb-2 text-3xl font-semibold">
                  {book.title}
                </span>
                <span className="mb-20">
                  {book.genre.map((g: string, index: number) => (
                    <span key={index}>{g}</span>
                  ))}
                </span>
                <span className=" w-2/3 text-base">{book.description}</span>
              </div>
              <div className="flex flex-col">
                <img
                  className="h-80 w-72"
                  alt="Book Cover"
                  src={`${book.image}`}
                />
                <span className="my-2">저자 {book.writer}</span>
                <span>
                  출판 {book.publisher} {book.pubDate}
                </span>
              </div>
            </div>
          </div>
          <div className="py-4">
            <div>
              <span className=" text-2xl font-semibold">리뷰</span>
              <section className="mt-5 flex h-40 w-full justify-center">
                <div className="flex h-full w-1/3 flex-col">
                  <h3 className="">내 별점</h3>
                  <div className="flex h-full flex-col items-center justify-center">
                    <span>별점점수</span>
                    <span>일단 이거</span>
                    <div className="flex">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                  </div>
                </div>
                <div className="flex h-full w-1/3 flex-col">
                  <h3 className="">내 별점</h3>
                  <div className="flex h-full flex-col items-center justify-center">
                    <span>별점점수</span>
                    <span>일단 이거</span>
                    <div className="flex">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                  </div>
                </div>
                <div className="flex h-full w-1/3 flex-col">
                  <h3 className="">내 별점</h3>
                  <div className="flex h-full flex-col items-center justify-center">
                    <span>별점점수</span>
                    <span>일단 이거</span>
                    <div className="flex">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div
                  onClick={inputActiveClick}
                  className="my-5 h-32 w-full bg-slate-600"
                >
                  <textarea
                    ref={textareaRef}
                    className={`${isReviewActive ? "h-1/2" : "h-full"} transition-height w-full  bg-slate-300 p-2  duration-300`}
                  />
                </div>
                {book.review.length == 0 ? (
                  <span>등록된 리뷰가 없어요</span>
                ) : (
                  <ul className="mt-7 flex flex-col">
                    {book.review.map((review: any) => (
                      <li
                        key={review._id}
                        className="mb-5 flex h-28 flex-col justify-between border-b border-solid border-slate-400  pb-4"
                      >
                        <div className="flex w-full justify-between">
                          <span>{formatDate(review.createdAt)}</span>
                          <div>
                            {review.author.nickname}(
                            {maskUsername(review.author.username)})
                          </div>
                        </div>
                        <div>{review.content}</div>
                        <div className="flex items-center">
                          {review.likes.includes(userId) ? (
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

                          <span>
                            {reviewLikes[review._id] || review.likes.length}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
