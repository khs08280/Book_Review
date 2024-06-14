"use client";

import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "@/src/states/atoms";
import Loading from "@/src/components/loading";
import { SideBar } from "@/src/components/sideBar";
import { AllBookList } from "@/src/components/AllBook-list";
import Footer from "@/src/components/footer";
import LocalStorage from "@/src/hooks/localStorage";

const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/books");
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

export default function Books() {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [{ data: books, error, isLoading }] = useQueries({
    queries: [{ queryKey: ["books"], queryFn: fetchData }],
  });

  const [sortedBooks, setSortedBooks] = useState<IBook[]>([]);
  const [sortOption, setSortOption] = useState<string>("리뷰 많은 순");

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
        } else {
          LocalStorage.removeItem("isLoggedIn");
          setIsLoggedIn(false);
          router.push("/login");
        }
      } catch (error) {
        console.error("passport 재로그인 시도 중 에러: ", error);
      }
    };

    if (isLoggedIn) {
      refreshToLogin();
    }
  }, [isLoggedIn, setIsLoggedIn, router]);

  useEffect(() => {
    if (books) {
      let sortedBooks = [...books];
      if (sortOption === "리뷰 많은 순") {
        sortedBooks = sortedBooks.sort(
          (a, b) => b.review.length - a.review.length,
        );
      } else if (sortOption === "추천 많은 순") {
        sortedBooks = sortedBooks.sort(
          (a, b) => b.recommendations.length - a.recommendations.length,
        );
      } else if (sortOption === "최근 리뷰 순") {
        sortedBooks = sortedBooks.sort((a, b) => {
          const aRecent = new Date(a.review[0]?.createdAt || 0);
          const bRecent = new Date(b.review[0]?.createdAt || 0);
          return bRecent.getTime() - aRecent.getTime();
        });
      }
      setSortedBooks(sortedBooks);
    }
  }, [books, sortOption]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <SideBar />
      <div className="min-h-screen  dark:bg-dark-darker dark:text-light-light sm:p-10 lg:ml-52">
        <div className="mr-5 sm:w-full">
          <div className="flex-col p-5">
            <div className="mb-5 flex justify-between">
              <span className="text-2xl">모든 북스</span>
              <select
                className="grid grid-cols-2 rounded-md bg-gray-200 p-2 px-3 dark:bg-dark-dark lg:block"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="리뷰 많은 순">리뷰 많은 순</option>
                <option value="추천 많은 순">추천 많은 순</option>
                <option value="최근 리뷰 순">최근 리뷰 순</option>
              </select>
            </div>
            <AllBookList books={sortedBooks} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
