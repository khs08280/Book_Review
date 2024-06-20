"use client";
import ArticlePagination from "@/src/components/ArticlePaging";
import CommunitySearchForm from "@/src/components/CommunitySearchForm";
import CommunityNav from "@/src/components/communityNav";
import Footer from "@/src/components/footer";
import { SideBar } from "@/src/components/sideBar";
import { formatDate } from "@/src/hooks/checkDate";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";

export default function CommunitySearch() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");

  const query = useSearchParams();
  const searchContent = query.get("searchText");
  const [articles, setArticles] = useState<IArticle[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (page: number) => {
      const response = await fetch(
        `https://bookreviewserver.shop/api/articles/searchArticle?searchText=${searchContent}&page=${page}`,
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
      setArticles(data.data);
    };
    fetchData(currentPage);
  }, [query]);

  const handleArticleSearch = (e: any) => {
    e.preventDefault();
    if (searchText.length < 2) {
      alert("검색어는 2글자 이상이어야 합니다.");
    } else {
      setSearchText("");
      router.push(`/community/search?searchText=${searchText}`);
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    router.push(`/community/search?searchText=${searchContent}&page=${page}`);
  };

  return (
    <>
      <SideBar />
      <div className="flex min-h-screen justify-center  px-2 py-5 dark:bg-dark-darker dark:text-light-light sm:p-10 lg:ml-52">
        <main className="h-screen w-full bg-green-200 px-2 dark:bg-dark-darker lg:w-7/12">
          <CommunityNav />
          <section className="flex flex-col">
            <ul>
              {articles &&
                articles.map((article: IArticle) => (
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

                      <Link
                        href={`/community/article?articleId=${article._id}`}
                      >
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
            <CommunitySearchForm
              searchText={searchText}
              setSearchText={setSearchText}
              handleArticleSearch={handleArticleSearch}
            />
            <ArticlePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
