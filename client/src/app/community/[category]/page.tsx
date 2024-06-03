"use client";

import CommunityNav from "@/src/components/communityNav";
import { SideBar } from "@/src/components/sideBar";
import { formatDate } from "@/src/hooks/checkDate";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";

export default function CommunityCategory() {
  const { category } = useParams();
  const getArticleList = async () => {
    const response = await fetch(
      `http://localhost:5000/api/articles/category/${category}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    const data = await response.json();

    return data.data;
  };

  const { data: articles, isLoading } = useQuery<IArticle[]>({
    queryKey: ["categoryArticles", category],
    queryFn: getArticleList,
  });

  return (
    <>
      <SideBar />
      <div className="ml-52 flex justify-center p-10">
        <main className="h-screen w-7/12 bg-slate-500">
          <CommunityNav />
          <section className="flex flex-col">
            <ul>
              {articles &&
                articles.map((article: any) => (
                  <li
                    key={article._id}
                    className="flex flex-col rounded-lg border-2 border-solid border-black border-opacity-40 bg-light-light p-2 py-3"
                  >
                    <div className="mb-2">
                      <span className="mr-2 rounded-lg bg-green-400 p-2 py-1 text-sm">
                        {article.category || "자유"}
                      </span>
                      <Link href={`/community/article/${article._id}`}>
                        <span>{article.title}</span>
                      </Link>
                    </div>
                    <div className="flex text-xs opacity-35">
                      <span className="mr-3">{article.author.nickname}</span>
                      <span className="mr-3">
                        {formatDate(article.createdAt)}
                      </span>
                      <span className="mr-3 flex items-center">
                        <FaRegEye className="mr-1" /> {article.view}
                      </span>
                      <span className="flex items-center">
                        <AiOutlineLike className="mr-1" />{" "}
                        {article.likes?.length}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
            <Link href={"/community/article/write"}>
              <div className="mt-5 h-fit max-w-fit cursor-pointer self-end rounded-lg bg-green-200 p-3 hover:bg-green-400">
                글 쓰기
              </div>
            </Link>
          </section>
        </main>
      </div>
    </>
  );
}
