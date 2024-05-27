"use client";

import { SideBar } from "@/src/components/sideBar";
import { maskUsername } from "@/src/hooks/maskUsername";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";

export default function ArticlePage() {
  const params = useParams();
  const fetchData = async () => {
    const response = await fetch(
      `http://localhost:5000/api/articles/${params.articleId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    const data = await response.json();
    console.log(data.data);
    return data.data;
  };
  const { data: article, isLoading } = useQuery<IArticle>({
    queryKey: ["article", params.articleId],
    queryFn: fetchData,
  });

  return (
    <>
      <SideBar />
      <div className="ml-52 flex justify-center p-10">
        {article && (
          <main className="h-screen w-7/12 bg-slate-500 p-10">
            <div>
              <span className=" mr-2 rounded-lg bg-green-400 p-2 py-1 text-base">
                카테고리
              </span>
              <span className="text-xl">{article.title}</span>
            </div>
            <div className="flex">
              <span>
                {article.author.nickname} (
                {maskUsername(article.author.username)})
              </span>
              <span>{article.content}</span>
              <span className="mr-3 flex items-center">
                <FaRegEye className="mr-1" /> {article.view}
              </span>
              <span className="flex items-center ">
                <AiOutlineLike className="mr-1" />
                {article.likes?.length}
              </span>
            </div>
          </main>
        )}
      </div>
    </>
  );
}
