"use client";

import { SideBar } from "../components/sideBar";
import { useEffect, useMemo, useCallback } from "react";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import LocalStorage from "../hooks/localStorage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import Footer from "../components/footer";
import Loading from "../components/loading";
import Link from "next/link";
import { formatDate } from "../hooks/checkDate";
import { AiOutlineLike } from "react-icons/ai";
import dynamic from "next/dynamic";

const DynamicBookList = dynamic(() => import("../components/book-list"), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const fetchData = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export default function Home() {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [
    { data: books = [], error, isLoading },
    { data: oneLines = [] },
    { data: articles = [] },
  ] = useQueries({
    queries: [
      {
        queryKey: ["books", "home"],
        queryFn: () => fetchData("http://localhost:5000/api/books"),
      },
      {
        queryKey: ["oneLines", "home"],
        queryFn: () => fetchData("http://localhost:5000/api/oneLines"),
      },
      {
        queryKey: ["articles", "home"],
        queryFn: () => fetchData("http://localhost:5000/api/articles"),
      },
    ],
  });

  const router = useRouter();
  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);

  useEffect(() => {
    const refreshToLogin = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/refreshToLogin",
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        if (!response.ok) {
          LocalStorage.removeItem("isLoggedIn");
          setIsLoggedIn(false);
          console.log("여기야");
          router.push("/login");
        }
        console.log("refreshToLogin");
      } catch (error) {
        console.error("passport 재로그인 시도 중 에러: ", error);
      }
    };

    if (isLoggedIn) {
      refreshToLogin();
    }
  }, [isLoggedIn, setIsLoggedIn, router]);

  const sortByReviewCount = useCallback((books: IBook[]) => {
    return [...books].sort(
      (a, b) => (b.review.length || 0) - (a.review.length || 0),
    );
  }, []);

  const sortByRecentReview = useCallback((books: IBook[]) => {
    return [...books].sort((a, b) => {
      const aRecent = new Date(a.review[0]?.createdAt || 0);
      const bRecent = new Date(b.review[0]?.createdAt || 0);
      return bRecent.getTime() - aRecent.getTime();
    });
  }, []);

  const filterByGenre = useCallback((books: IBook[], genres: string[]) => {
    return books.filter((book) =>
      book.genre.some((genre) => genres.includes(genre)),
    );
  }, []);

  const getRandomBooks = useCallback((books: IBook[], count: number) => {
    const shuffled = [...books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }, []);

  const booksSortedByReviewCount = useMemo(
    () => sortByReviewCount(books),
    [books, sortByReviewCount],
  );
  const booksSortedByRecentReview = useMemo(
    () => sortByRecentReview(books),
    [books, sortByRecentReview],
  );
  const booksFilteredByGenre = useMemo(
    () => filterByGenre(books, ["웹소설", "웹툰"]),
    [books, filterByGenre],
  );
  const randomBooks = useMemo(
    () => getRandomBooks(books, 5),
    [books, getRandomBooks],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <SideBar />
      <div className="grid grid-cols-1 grid-rows-6 gap-5  p-5 dark:bg-dark-darker dark:text-light-light sm:p-10 lg:ml-52 lg:grid-cols-3 lg:grid-rows-4">
        <div className="col-span-1 mr-5 sm:w-full lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2">
          <div className="block h-2/3 flex-col overflow-hidden  lg:h-bool_list_height lg:px-4">
            <div className="mb-5 text-2xl">Hot 리뷰 북스</div>
            <DynamicBookList books={booksSortedByReviewCount} />
          </div>
        </div>

        <div className="col-span-1 mr-5 lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3">
          <div className="block h-2/3 flex-col overflow-hidden  lg:h-bool_list_height lg:px-4">
            <div className="mb-5 text-2xl">New 리뷰 북스</div>
            <DynamicBookList books={booksSortedByRecentReview} />
          </div>
        </div>

        <div className="col-span-1 mr-5 lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-4">
          <div className="block h-2/3 flex-col overflow-hidden  lg:h-bool_list_height lg:px-4">
            <div className="mb-5 text-2xl">웹소설/웹툰</div>
            <DynamicBookList books={booksFilteredByGenre} />
          </div>
        </div>

        <div className="col-span-1 mr-5 lg:col-start-1 lg:col-end-3 lg:row-start-4 lg:row-end-5">
          <div className="block h-2/3 flex-col overflow-hidden  lg:h-bool_list_height lg:px-4">
            <div className="mb-5 text-2xl">랜덤 북스</div>
            <DynamicBookList books={randomBooks} />
          </div>
        </div>

        <div className="col-span-1 mb-3 h-1/2 px-5 lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3 lg:ml-8">
          <h2 className="mb-5 text-2xl">지금 커뮤니티는?</h2>
          <ul>
            {articles &&
              articles.map((article: IArticle) => (
                <li
                  key={article._id}
                  className="flex w-full justify-between rounded-lg border-2 border-solid border-green-400 border-opacity-40 bg-green-200 px-4 py-3 dark:border-opacity-10 dark:bg-dark-dark"
                >
                  <div className="flex flex-col">
                    <div className="mb-2">
                      <Link href={`/community/article/${article._id}`}>
                        <span>{article.title}</span>
                      </Link>
                    </div>
                    <div className="flex text-xs opacity-35">
                      <span className="mr-3">{article.author.nickname}</span>
                      <span className="mr-3">
                        {formatDate(article.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <AiOutlineLike className="mr-1" />
                        {article.likes?.length}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="col-span-1 mb-3 h-1/2 px-5 lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-5 lg:ml-8">
          <div>
            <h2 className="mb-5 text-2xl">한줄 책 추천</h2>
            <ul>
              {oneLines &&
                oneLines.map((oneLine: IOneLine) => (
                  <li
                    key={oneLine._id}
                    className="flex w-full justify-between rounded-lg border-2 border-solid border-green-400 border-opacity-40 bg-green-200 px-4 py-3 dark:border-opacity-10 dark:bg-dark-dark"
                  >
                    <div className="flex flex-col">
                      <div className="mb-2">
                        <Link href={`/oneLine`}>
                          <span>{oneLine.content}</span>
                        </Link>
                      </div>
                      <div className="flex text-xs opacity-35">
                        <span className="mr-3">{oneLine.author.nickname}</span>
                        <span className="mr-3">
                          {formatDate(oneLine.createdAt)}
                        </span>
                      </div>
                    </div>
                    {oneLine.book?.image && (
                      <img
                        src={oneLine.book?.image}
                        alt={oneLine.book.title}
                        className="h-16 w-12"
                      />
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
