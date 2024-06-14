"use client";

import CommunityNav from "@/src/components/communityNav";
import Footer from "@/src/components/footer";
import { SideBar } from "@/src/components/sideBar";
import { formatDate } from "@/src/hooks/checkDate";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";
import CommunityLoading from "./loading";

export default function Community() {
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

  const { data: articles, isLoading } = useQuery<IArticle[]>({
    queryKey: ["articles"],
    queryFn: getArticleList,
  });

  if (isLoading) {
    return <CommunityLoading />;
  }

  return (
    <>
      <SideBar />
      <div className="flex min-h-screen justify-center  px-2 py-5 dark:bg-dark-darker dark:text-light-light sm:p-10 lg:ml-52">
        <main className="h-screen w-full bg-green-200 px-2 dark:bg-dark-darker lg:w-7/12">
          <CommunityNav />
          <section className="flex flex-col">
            <ul>
              {articles &&
                articles.map((article: any) => (
                  <li
                    key={article._id}
                    className=" flex flex-col rounded-lg border-2 border-solid border-green-400 border-opacity-40 bg-light-light p-2 py-3 dark:border-opacity-10 dark:bg-dark-dark"
                  >
                    <div className="mb-2">
                      {article.category ? (
                        <span className=" mr-2 rounded-lg bg-green-400 p-2 py-1 text-sm">
                          {article.category}
                        </span>
                      ) : (
                        <span className=" mr-2 rounded-lg bg-green-400 p-2 py-1 text-sm">
                          자유
                        </span>
                      )}

                      <Link href={`/community/article/${article._id}`}>
                        <span>{article.title}</span>
                      </Link>
                    </div>
                    <div className=" flex text-xs opacity-35 ">
                      <span className="mr-3">{article.author.nickname}</span>
                      <span className="mr-3">
                        {article.modifiedAt ? (
                          <span>{formatDate(article.modifiedAt)} (수정됨)</span>
                        ) : (
                          <span>{formatDate(article.createdAt)}</span>
                        )}
                      </span>
                      <span className="mr-3 flex items-center">
                        <FaRegEye className="mr-1" /> {article.view}
                      </span>
                      <span className="flex items-center ">
                        <AiOutlineLike className="mr-1" />
                        {article.likes?.length}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
            <Link className="w-fit self-end" href={"/community/article/write"}>
              <div className="float-end mt-5 cursor-pointer rounded-lg bg-green-400 p-3 transition-all hover:bg-green-600 dark:bg-dark-dark dark:hover:bg-stone-700">
                글 쓰기
              </div>
            </Link>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
