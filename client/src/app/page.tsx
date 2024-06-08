"use client";

import { BookList } from "../components/book-list";
import { SideBar } from "../components/sideBar";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import LocalStorage from "../hooks/localStorage";
import { getCookie } from "../utils/react-cookie";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import Footer from "../components/footer";

const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/books");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export default function Home() {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const { data: books, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: fetchData,
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
  }, []);

  return (
    <>
      <SideBar />
      <div className=" ml-52 flex h-full bg-slate-400 p-5">
        <div className="mr-5  grid w-4/6 grid-cols-2 grid-rows-4 gap-5">
          <div className="col-span-2">
            <div className="mb-2 text-2xl">Hot 리뷰 북스</div>
            <BookList books={books} />
          </div>
          {/* <div className="col-span-2">
            <div className="mb-2 text-2xl">New 리뷰 북스</div>
            <BookList books={books} />
          </div>
          <div className="col-span-2">
            <div className="mb-2 text-2xl">웹소설도 북스야~</div>
            <BookList books={books} />
          </div>
          <div className="col-span-2">
            <div className="mb-2 text-2xl">이것도 읽어봐~</div>
            <BookList books={books} />
          </div> */}
        </div>
        <div className="flex flex-col">
          <div className="mb-3 h-1/2">
            <div className="mb-2 text-2xl">지금 커뮤니티는?</div>
          </div>
          <div className="">
            <div className="mb-2 text-2xl">한 줄 책 추천</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
