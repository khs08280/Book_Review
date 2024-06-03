"use client";

import DraftEditor from "@/src/components/draftEditor";
import { SideBar } from "@/src/components/sideBar";
import { isExpired } from "@/src/hooks/isExpired";
import LocalStorage from "@/src/hooks/localStorage";
import { EditorState, convertFromRaw } from "draft-js";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ArticleUpdate() {
  const [article, setArticle] = useState<IArticle>();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  let accessToken = LocalStorage.getItem("accessToken");
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const expired = await isExpired(accessToken);
      accessToken = LocalStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("액세스 토큰이 올바르지 않습니다");
        return;
      }
      if (expired) {
        console.log("만료되었거나 유효하지 않은 토큰입니다.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/articles/${params.articleId}`,
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
        setTitle(data.data.title || ""); // 데이터가 있을 때만 title 상태를 설정
        setContent(data.data.content || ""); // 데이터가 있을 때만 content 상태를 설정
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params.articleId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const updateArticle = async () => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken) {
      console.log("액세스 토큰이 올바르지 않습니다");
      return;
    }
    if (expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/articles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, content, articleId: article?._id }),
        credentials: "include",
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("게시글을 불러오는데 실패했습니다.");
      }
      router.push(`/community/${params.articleId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SideBar />
      <div className="ml-52 flex justify-center p-10">
        <main className="flex h-screen w-7/12 flex-col space-y-4 bg-slate-500 p-5">
          <span className="mb-4 text-2xl text-white">게시글 수정</span>
          <input
            onChange={handleTitleChange}
            value={title}
            placeholder="제목"
            className="rounded border border-gray-300 p-2"
          />
          <div className="h-64 rounded border border-gray-300 bg-white p-2">
            <DraftEditor
              setContent={setContent}
              alreadyEditorState={article?.content}
            />
          </div>
          <div onClick={updateArticle}>수정</div>
        </main>
      </div>
    </>
  );
}
