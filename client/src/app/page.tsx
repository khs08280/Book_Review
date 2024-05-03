"use client";
import axios from "axios";
import { BookList } from "../components/book-list";
import { Header } from "../components/header";
import { SideBar } from "../components/sideBar";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/books");
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Header />
      <SideBar />
      <div className=" h-full p-5 ml-52 bg-slate-400 flex">
        <div className="w-4/6  grid gap-5 grid-cols-2 grid-rows-4 mr-5">
          <div className="col-span-2">
            <div className="text-2xl mb-2">Hot 리뷰 북스</div>
            <BookList />
          </div>
          <div className="col-span-2">
            <div className="text-2xl mb-2">New 리뷰 북스</div>
            <BookList />
          </div>
          <div className="col-span-2">
            <div className="text-2xl mb-2">웹소설도 북스야~</div>
            <BookList />
          </div>
          <div className="col-span-2">
            <div className="text-2xl mb-2">이것도 읽어봐~</div>
            <BookList />
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
