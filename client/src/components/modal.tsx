import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import LocalStorage from "../hooks/localStorage";
import { getUserId, isExpired } from "../hooks/isExpired";
import { useRouter } from "next/navigation";
import ReviewItem from "./reviewItem";
import Stars from "./stars";
import AverageStars from "./AverageStars";
import { motion, AnimatePresence } from "framer-motion";
import { useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import useClickOutside from "../hooks/outsideClick";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

function Modal({ isOpen, onClose, bookId }: any) {
  const [isReviewActive, setIsReviewActive] = useState(false);
  const [reviewLikes, setReviewLikes] = useState<{ [key: string]: number }>({});
  const [isLikeClicked, setIsLikeClicked] = useState<{
    [key: string]: boolean;
  }>({});
  const [userId, setUserId] = useState<string | null>("");
  const [reviewContent, setReviewContent] = useState("");
  const [isExistReview, setIsExistReview] = useState(false);
  const [sortedReviews, setSortedReviews] = useState<IReview[]>([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [myRating, setMyRating] = useState<number | null>(null);
  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);

  const [bookRecommend, setBookRecommend] = useState<{ [key: string]: number }>(
    {},
  );
  const [isRecommendClicked, setIsRecommendClicked] = useState<{
    [key: string]: boolean;
  }>({});

  const textareaRef = useRef<HTMLDivElement>(null);
  let accessToken = LocalStorage.getItem("accessToken");
  let isLoggedIn = LocalStorage.getItem("isLoggedIn");

  const router = useRouter();
  const queryClient = useQueryClient();

  const data = {
    content: reviewContent,
    userId,
    bookId,
  };
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "https://bookreviewserver.shop/api/reviews",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          mode: "cors",
          credentials: "include",
        },
      );
      if (!response.ok) {
        console.log(response.json());
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onError: (error) => {
      console.error("Review creation error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });
  const updateData = {
    content: reviewContent,
    reviewId: selectedReview?._id,
  };
  const updateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "https://bookreviewserver.shop/api/reviews",
        {
          method: "PATCH",
          body: JSON.stringify(updateData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          mode: "cors",
          credentials: "include",
        },
      );
      console.log(response);
    },

    onError: (error) => {
      console.error("Review creation error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
      setIsUpdateMode(false);
      setReviewContent("");
    },
  });
  const updateReview = async () => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      setIsLoggedIn(false);
      LocalStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }
    accessToken = LocalStorage.getItem("accessToken");
    updateMutation.mutate();
  };
  const handleUpdateReview = (review: IReview) => {
    setSelectedReview(review);
    setReviewContent(review.content);
    setIsUpdateMode(true);
    if (textareaRef.current) {
      textareaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const createReview = async () => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      setIsLoggedIn(false);
      LocalStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }
    await mutation.mutateAsync();
    setReviewContent("");
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://bookreviewserver.shop/api/books/${bookId}`,
      );
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
  const handleRating = async (rating: number) => {
    const ratingData = {
      bookId,
      rating,
    };
    const expired = await isExpired(accessToken);

    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      router.push("/login");
      return;
    }
    accessToken = LocalStorage.getItem("accessToken");

    const response = await fetch(
      "https://bookreviewserver.shop/api/reviews/handleRating",
      {
        method: "PUT",
        body: JSON.stringify(ratingData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
        credentials: "include",
      },
    );
    const data = await response.json();
    setMyRating(data);
  };

  useClickOutside(textareaRef, () => {
    setIsReviewActive(false);
    setIsUpdateMode(false);
  });

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const expired = await isExpired(accessToken);

        if (!accessToken || expired) {
          console.log("만료되었거나 유효하지 않은 토큰입니다.");
          return;
        }
        accessToken = LocalStorage.getItem("accessToken");

        const response = await fetch(
          `https://bookreviewserver.shop/api/books/${bookId}/rating`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
            method: "GET",
          },
        );
        const data = await response.json();
        if (response.status !== 200) {
          console.log(data);
        }
        if (data.rating !== null) {
          setMyRating(data.rating);
        } else {
          setMyRating(null);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // 오류 처리를 수행하거나 사용자에게 알림을 보여줄 수 있음
      }
    };
    if (isLoggedIn) {
      fetchRating();
    }
  }, [bookId, isLoggedIn]);

  useEffect(() => {
    const fetchData = async () => {
      const expired = await isExpired(accessToken);

      if (!accessToken || expired) {
        console.log("만료되었거나 유효하지 않은 토큰입니다.");
        return;
      }
      accessToken = LocalStorage.getItem("accessToken");

      const useId = await getUserId(accessToken);
      setUserId(useId);
    };
    fetchData();
  }, [accessToken]);

  useEffect(() => {
    if (book) {
      const initialReviewLikes: { [key: string]: number } = {};
      const initialIsLikeClicked: { [key: string]: boolean } = {};

      const initialBookRecommend: { [key: string]: number } = {};
      const initialIsRecommendClicked: { [key: string]: boolean } = {};

      book.review.forEach((review: IReview) => {
        initialReviewLikes[review._id] = review.likes.length;
        initialIsLikeClicked[review._id] = review.likes.includes(
          userId as never,
        );
      });

      initialBookRecommend[book._id] = book.recommendations.length;
      initialIsRecommendClicked[book._id] = book.recommendations.includes(
        userId as never,
      );

      setReviewLikes(initialReviewLikes);
      setIsLikeClicked(initialIsLikeClicked);

      setBookRecommend(initialBookRecommend);
      setIsRecommendClicked(initialIsRecommendClicked);
    }
    if (book && book.review && userId) {
      const isExist = book.review.some(
        (review: IReview) => review.author._id === userId,
      );
      setIsExistReview(isExist);
    }
    if (book?.review && userId) {
      const userReview = book.review.find(
        (review: IReview) => review.author._id === userId,
      );
      const otherReviews = book.review.filter(
        (review: IReview) => review.author._id !== userId,
      );
      setSortedReviews([userReview, ...otherReviews]);
    } else {
      setSortedReviews(book?.review);
    }
  }, [book, userId]);
  if (!isOpen || isLoading || !book) {
    return null;
  }
  const likeClick = async (reviewId: string) => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      setIsLoggedIn(false);
      LocalStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }
    accessToken = LocalStorage.getItem("accessToken");
    try {
      const response = await fetch(
        "https://bookreviewserver.shop/api/reviews/handleLike",
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
  const handleRecommend = async (bookId: string) => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      setIsLoggedIn(false);
      LocalStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }
    const response = await fetch(
      "https://bookreviewserver.shop/api/books/recommend",
      {
        method: "POST",
        body: JSON.stringify({ bookId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
        credentials: "include",
      },
    );
    if (!response.ok) {
      console.error("서버 쪽에 문제가 생김");
    }

    const responseData = await response.json();
    setIsRecommendClicked((prevState) => ({
      ...prevState,
      [bookId]: !prevState[bookId],
    }));
    setBookRecommend((prevState) => ({
      ...prevState,
      [bookId]: responseData.recommendations,
    }));
    console.log(responseData);
  };

  return (
    <motion.div
      onClick={falseActiveClick}
      className="fixed inset-0 z-30  bg-black bg-opacity-30"
      layoutId={bookId}
    >
      <div className="flex h-screen items-center justify-center">
        <div
          onClick={handleModalClick}
          className=" relative h-full w-modal_width overflow-y-auto rounded-lg bg-white p-10 shadow-lg dark:bg-dark-darker dark:text-light-light lg:h-4/5"
        >
          <div className="absolute right-3 top-3 ">
            <button onClick={onClose}>
              <IoClose className="size-8" />
            </button>
          </div>
          <div
            className={`mb-7 h-2/3 place-content-center  rounded-lg bg-green-200 bg-center px-5  text-green-500 dark:text-green-300`}
          >
            <div className="z-30 flex items-center justify-between ">
              <div className="flex flex-col ">
                <div className="mb-1 flex w-fit  items-center rounded-md bg-slate-200 px-2 py-1 text-lg  font-semibold dark:bg-dark-dark">
                  <FaStar className="mr-2 size-5 " style={{ flexShrink: 0 }} />
                  <span>{Math.ceil(book.averageRating * 10) / 10}</span>
                </div>
                <span className="my-4 text-3xl font-semibold">
                  {book.title}
                </span>
                <span className="mb-12">
                  {book.genre.map((genre: string, index: number) => (
                    <span key={index}>{genre}</span>
                  ))}
                </span>
                <span className=" mb-5 w-2/3 text-base">
                  {book.description}
                </span>
                <div
                  onClick={() => handleRecommend(book._id)}
                  className=" z-50 flex w-fit cursor-pointer  items-center rounded-md border-2 border-solid border-green-400 bg-transparent p-2 px-4 text-green-400 transition-all hover:bg-green-100 dark:border-opacity-10 dark:bg-dark-dark dark:text-white dark:hover:bg-stone-600"
                >
                  {isRecommendClicked[book._id] ? (
                    <AiFillLike className=" size-5 cursor-pointer text-green-400" />
                  ) : (
                    <AiOutlineLike className=" size-5 cursor-pointer" />
                  )}
                  <span className="ml-2">{bookRecommend[book._id]}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <img
                  className="h-80 w-60"
                  alt={book.title}
                  src={`${book.image}`}
                />
                <span className="my-2">저자 {book.writer}</span>
                <span>
                  출판 {book.publisher} {book.pubDate}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t-2 border-solid border-green-200 border-opacity-40 py-4">
            <div>
              <span className=" text-2xl font-semibold">리뷰</span>
              <section className="mt-5 flex h-40 w-full justify-center">
                <div className="flex h-full w-1/3 flex-col">
                  <h3 className="">내 별점</h3>
                  <Stars handleRating={handleRating} myRating={myRating} />
                </div>
                <div className="flex h-full w-1/3 flex-col">
                  <h3 className="">평균 별점</h3>
                  <AverageStars
                    averageRating={book.averageRating}
                    ratingCount={book.ratingCount}
                  />
                </div>
              </section>
              <section>
                {isExistReview ? null : (
                  <div
                    onClick={inputActiveClick}
                    ref={textareaRef}
                    className="relative my-5 h-32 w-full bg-green-500"
                  >
                    <textarea
                      maxLength={300}
                      onChange={(e) => setReviewContent(e.target.value)}
                      value={reviewContent}
                      placeholder="리뷰를 입력해주세요"
                      className={`${isReviewActive ? "h-1/2" : "h-full"} w-full resize-none bg-green-500 p-3 placeholder:text-green-200 focus:outline-none`}
                    />
                    {isReviewActive ? (
                      <div className="absolute bottom-0 flex h-1/2 w-full items-center justify-between px-5">
                        <span>{reviewContent.length} / 300</span>
                        <div
                          onClick={createReview}
                          className="cursor-pointer rounded-md  px-2 py-2 text-stone-600 transition-all hover:bg-green-200"
                        >
                          등록
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
                {isUpdateMode ? (
                  <div
                    onClick={inputActiveClick}
                    ref={textareaRef}
                    className="relative my-5 h-32 w-full bg-slate-600"
                  >
                    <textarea
                      maxLength={300}
                      onChange={(e) => setReviewContent(e.target.value)}
                      value={reviewContent}
                      className={`${isReviewActive ? "h-1/2" : "h-full"} w-full resize-none bg-slate-600 p-2 focus:outline-none`}
                    />
                    {isReviewActive ? (
                      <div className="absolute bottom-0 flex h-1/2 w-full items-center justify-between px-5">
                        <span>{reviewContent.length} / 300</span>
                        <div className="flex">
                          <span className=" cursor-pointer rounded-md  px-2 py-3 text-dark-dark transition-all hover:bg-green-200">
                            취소
                          </span>

                          <div
                            onClick={updateReview}
                            className="cursor-pointer rounded-md  px-2 py-3 text-sky-600 transition-all hover:bg-slate-200"
                          >
                            수정
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {book.review && book.review.length > 0 ? (
                  <ul className="mt-7 flex flex-col">
                    {sortedReviews &&
                      sortedReviews.map((review: IReview, index: number) =>
                        review ? (
                          <ReviewItem
                            key={review._id}
                            bookId={bookId}
                            accessToken={accessToken}
                            userId={userId}
                            review={review}
                            likeClick={likeClick}
                            isLikeClicked={isLikeClicked}
                            reviewLikes={reviewLikes}
                            setIsUpdateMode={setIsUpdateMode}
                            handleUpdateReview={handleUpdateReview}
                            myRating={myRating}
                            isUserReview={
                              review &&
                              index === 0 &&
                              review.author._id === userId
                            }
                          />
                        ) : null,
                      )}
                  </ul>
                ) : (
                  <span>등록된 리뷰가 없습니다.</span>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Modal;
