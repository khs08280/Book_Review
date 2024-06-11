"use client";

import { BookList } from "../components/book-list";
import { SideBar } from "../components/sideBar";
import { Suspense, useEffect, useState } from "react";
import {
  useQueries,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import LocalStorage from "../hooks/localStorage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import Footer from "../components/footer";
import Loading from "../components/loading";
import Link from "next/link";
import { formatDate } from "../hooks/checkDate";
import { AiOutlineLike } from "react-icons/ai";

const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/books");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data.data);
    return data.data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};
const fetchOneLines = async () => {
  const response = await fetch(`http://localhost:5000/api/oneLines`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  console.log(data.data);
  return data.data;
};

const getArticleList = async () => {
  const response = await fetch("http://localhost:5000/api/articles", {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();

  return data.data;
};

export default function Home() {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [
    { data: books, error, isLoading },
    { data: oneLines },
    { data: articles },
  ] = useQueries({
    queries: [
      { queryKey: ["books"], queryFn: fetchData },
      { queryKey: ["oneLines", "home"], queryFn: fetchOneLines },
      { queryKey: ["articles", "home"], queryFn: getArticleList },
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
        if (response.ok) {
          console.log("refreshToLogin");
        } else {
          LocalStorage.removeItem("isLoggedIn");
          setIsLoggedIn(false);
          router.push("/login");
          console.error("passport 재로그인에 실패");
        }
      } catch (error) {
        console.error("passport 재로그인 시도 중 에러: ", error);
      }
    };

    if (isLoggedIn) {
      refreshToLogin();
    }
  }, [isLoggedIn, setIsLoggedIn, router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <SideBar />
      <div className="ml-52 flex h-full bg-slate-400 p-10 dark:bg-dark-darker dark:text-light-light">
        <div className="mr-5 grid w-4/6 grid-cols-2 grid-rows-4 gap-5">
          <div className="col-span-2 w-full flex-col">
            <div className="mb-5 text-2xl">Hot 리뷰 북스</div>
            <BookList books={books} />
          </div>
        </div>
        <div className="flex w-1/3 flex-col">
          <div className="mb-3 ml-8 h-1/2 ">
            <div className="">
              <h2 className="mb-5 text-2xl">지금 커뮤니티는?</h2>
              <ul>
                {articles &&
                  articles.map((article: IArticle) => (
                    <li
                      key={article._id}
                      className="flex w-full justify-between   rounded-lg border-2 border-solid border-black border-opacity-40 bg-light-light px-4 py-3 dark:bg-dark-dark"
                    >
                      <div className="flex flex-col">
                        <div className="mb-2">
                          <Link href={`/community/article/${article._id}`}>
                            <span>{article.title}</span>
                          </Link>
                        </div>
                        <div className=" flex text-xs opacity-35 ">
                          <span className="mr-3">
                            {article.author.nickname}
                          </span>
                          <span className="mr-3">
                            {formatDate(article.createdAt)}
                          </span>
                          <span className="flex items-center ">
                            <AiOutlineLike className="mr-1" />
                            {article.likes?.length}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="mb-3 ml-8 h-1/2 ">
            <div className="">
              <h2 className="mb-5 text-2xl">한줄 책 추천</h2>
              <ul>
                {oneLines &&
                  oneLines.map((oneLine: IOneLine) => (
                    <li
                      key={oneLine._id}
                      className="flex w-full  justify-between rounded-lg border-2 border-solid border-black border-opacity-40 bg-light-light px-4 py-3 dark:bg-dark-dark"
                    >
                      <div className="flex flex-col">
                        <div className="mb-2">
                          <Link href={`/oneLine`}>
                            <span>{oneLine.content}</span>
                          </Link>
                        </div>
                        <div className=" flex text-xs opacity-35 ">
                          <span className="mr-3">
                            {oneLine.author.nickname}
                          </span>
                          <span className="mr-3">
                            {formatDate(oneLine.createdAt)}
                          </span>
                          {/* <span className="flex items-center ">
                      <AiOutlineLike className="mr-1" />
                      {oneLine.likes?.length}
                    </span> */}
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
      </div>
      <Footer />
    </>
  );
}
