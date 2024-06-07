"use client";

import { SideBar } from "@/src/components/sideBar";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BookDetailPage from "../books/[bookId]/page";
import Footer from "@/src/components/footer";

export default function Search() {
  const query = useSearchParams();
  const searchText = query.get("searchText");
  const [data, setData] = useState<IBook[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:5000/api/books/searchBook?searchText=${searchText}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, [query]);
  return (
    <>
      <SideBar />
      <div className="ml-52 min-h-screen p-5 px-10">
        {/* <BookDetailPage /> */}
        <span className="text-xl font-semibold">
          {searchText}에 대한 검색 결과
        </span>
        <div className=" mt-5 flex">
          {data.map((book) => (
            <Link href={`/books/${book._id}`}>
              <motion.div
                key={book._id}
                className="h-120 mr-10 flex  cursor-pointer flex-col items-center rounded-lg border-2 border-solid border-gray-300 p-5"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                layoutId={book._id}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="mb-3 h-60 w-40"
                />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
