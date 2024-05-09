"use client";

import { BookList } from "../components/book-list";
import { SideBar } from "../components/sideBar";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

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
  const {
    data: books,
    isLoading,
    error,
  } = useQuery({ queryKey: ["books"], queryFn: fetchData });

  return (
    <>
      <SideBar />
      <div className=" h-full p-5 ml-52 bg-slate-400 flex">
        <div className="w-4/6  grid gap-5 grid-cols-2 grid-rows-4 mr-5">
          <div className="col-span-2">
            <div className="text-2xl mb-2">Hot 리뷰 북스</div>
            <BookList books={books} />
          </div>
          <div className="col-span-2">
            <div className="text-2xl mb-2">New 리뷰 북스</div>
            <BookList books={books} />
          </div>
          <div className="col-span-2">
            <div className="text-2xl mb-2">웹소설도 북스야~</div>
            <BookList books={books} />
          </div>
          <div className="col-span-2">
            <div className="text-2xl mb-2">이것도 읽어봐~</div>
            <BookList books={books} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="h-1/2 mb-3">
            <div className="text-2xl mb-2">지금 커뮤니티는?</div>
          </div>
          <div className="">
            <div className="text-2xl mb-2">한 줄 책 추천</div>
          </div>
        </div>
      </div>
    </>
  );
}
