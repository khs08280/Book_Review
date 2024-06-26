"use client";

import { SideBar } from "@/src/components/sideBar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/src/components/footer";

function SearchContent() {
  const query = useSearchParams();
  const searchText = query.get("searchText");
  const [data, setData] = useState<IBook[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://bookreviewserver.shop/api/books/searchBook?searchText=${searchText}`,
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
    <div className="min-h-screen p-5 px-10 dark:bg-dark-darker dark:text-light-light lg:ml-52">
      <span className="text-xl font-semibold">
        {searchText}에 대한 검색 결과
      </span>
      <div className="mt-5 flex">
        {data.map((book) => (
          <Link href={`/books/${book._id}`} key={book._id}>
            <motion.div
              className="mr-10 flex cursor-pointer flex-col items-center rounded-lg border-2 border-solid border-gray-300 bg-green-300 p-5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              layoutId={book._id}
            >
              <img
                src={book.image}
                alt={book.title}
                className="mb-3 h-40 w-28 sm:h-60 sm:w-40"
              />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Search() {
  return (
    <>
      <SideBar />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </>
  );
}
