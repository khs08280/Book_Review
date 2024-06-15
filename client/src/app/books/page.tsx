"use client";

import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "@/src/states/atoms";
import Loading from "@/src/components/loading";
import { SideBar } from "@/src/components/sideBar";
import { AllBookList } from "@/src/components/AllBook-list";
import Footer from "@/src/components/footer";

const fetchBooks = async ({ pageParam = 1 }) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/books/all?page=${pageParam}`,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data || []; // data.data 대신 data로 변경
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export default function Books() {
  const [sortedBooks, setSortedBooks] = useState<IBook[]>([]);
  const [sortOption, setSortOption] = useState<string>("리뷰 많은 순");
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["books"],
      queryFn: fetchBooks,
      initialPageParam: 1, // 페이지 번호는 1부터 시작
      getNextPageParam: (lastPage, allPages) => {
        // 만약 마지막 페이지라면 다음 페이지가 없다고 표시
        if (lastPage.currentPage >= lastPage.totalPages) {
          return undefined;
        }
        return lastPage.currentPage + 1; // 다음 페이지 번호
      },
    });

  useEffect(() => {
    if (data) {
      const newBooks = data.pages.flatMap((page) => page.data); // data.data에서 data로 변경
      let sortedBooks = [...newBooks];
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
  }, [data, sortOption]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1 &&
      !isLoading &&
      hasNextPage &&
      !isFetching
    ) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <SideBar />
      <div className="min-h-screen dark:bg-dark-darker dark:text-light-light sm:p-10 lg:ml-52">
        <div className="mr-5 sm:w-full">
          <div className="flex-col p-5">
            <div className="mb-5 flex justify-between">
              <span className="text-2xl">모든 북스</span>
              <select
                className="rounded-md bg-gray-200 p-2 px-3 dark:bg-dark-dark lg:block"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="리뷰 많은 순">리뷰 많은 순</option>
                <option value="추천 많은 순">추천 많은 순</option>
                <option value="최근 리뷰 순">최근 리뷰 순</option>
              </select>
            </div>
            <AllBookList books={sortedBooks} />
            {isFetching && <Loading />}{" "}
            {/* 추가: 데이터를 추가로 로딩 중일 때 로딩 표시 */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
