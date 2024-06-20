"use client";

import DraftEditor from "@/src/components/draftEditor";
import Footer from "@/src/components/footer";
import { SideBar } from "@/src/components/sideBar";
import { isExpired } from "@/src/hooks/isExpired";
import LocalStorage from "@/src/hooks/localStorage";
import { isLoggedInAtom } from "@/src/states/atoms";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

export default function ArticleUpdate() {
  const [article, setArticle] = useState<IArticle>();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);

  let accessToken = LocalStorage.getItem("accessToken");

  const router = useRouter();
  const params = useSearchParams();
  const articleId = params.get("articleId");

  useEffect(() => {
    const fetchData = async () => {
      const expired = await isExpired(accessToken);
      accessToken = LocalStorage.getItem("accessToken");
      if (!accessToken || expired) {
        console.log("만료되었거나 유효하지 않은 토큰입니다.");
        setIsLoggedIn(false);
        LocalStorage.removeItem("accessToken");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `https://bookreviewserver.shop/api/articles/${articleId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        if (!response.ok) {
          throw new Error("게시글을 불러오는데 실패했습니다.");
        }
        const data = await response.json();

        setArticle(data.data);
        setTitle(data.data.title || "");
        setContent(data.data.content || "");
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [articleId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const updateArticle = async () => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      setIsLoggedIn(false);
      LocalStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://bookreviewserver.shop/api/articles`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title, content, articleId: article?._id }),
          credentials: "include",
          method: "PATCH",
        },
      );
      if (!response.ok) {
        throw new Error("게시글을 불러오는데 실패했습니다.");
      }
      router.push(`/community/article?articleId=${articleId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SideBar />
      <div className="flex justify-center dark:bg-dark-darker dark:text-light-light lg:ml-52 lg:p-10">
        <main className="flex h-screen  w-full flex-col space-y-4 bg-green-200 p-5 dark:bg-dark-dark lg:w-7/12">
          <span className="mb-4 text-2xl text-white">게시글 수정</span>
          <input
            onChange={handleTitleChange}
            value={title}
            placeholder="제목"
            className="rounded border border-gray-300 p-2 dark:bg-dark-dark"
          />
          <div className="h-64 rounded border border-solid border-gray-300 bg-white p-2 dark:border-opacity-40 dark:bg-dark-dark">
            <DraftEditor
              setContent={setContent}
              alreadyEditorState={article?.content}
            />
          </div>
          <div
            className="w-full cursor-pointer self-end rounded-md bg-green-400 px-3  py-2 text-center text-lg text-light-light sm:p-2 lg:w-fit"
            onClick={updateArticle}
          >
            수정
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
