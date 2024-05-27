"use client";

import DraftEditor from "@/src/components/draftEditor";
import { SideBar } from "@/src/components/sideBar";
import { isExpired } from "@/src/hooks/isExpired";
import LocalStorage from "@/src/hooks/localStorage";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommunityWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  let accessToken = LocalStorage.getItem("accessToken");
  const router = useRouter();

  const createArticle = async () => {
    const fetchData = {
      title,
      content,
    };
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
    console.log(title, content);
    const response = await fetch("http://localhost:5000/api/articles", {
      method: "POST",
      body: JSON.stringify(fetchData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      console.log(data);
    }
    router.push(`/community/${data.data._id}`);
  };

  return (
    <>
      <SideBar />
      <div className="ml-52 flex justify-center p-10">
        <main className="flex h-screen w-7/12 flex-col space-y-4 bg-slate-500 p-5">
          <span className="mb-4 text-2xl text-white">글 쓰기</span>
          <input
            placeholder="카테고리"
            className="rounded border border-gray-300 p-2"
          />
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="제목"
            className="rounded border border-gray-300 p-2"
          />
          <div className="h-64 rounded border border-gray-300 bg-white p-2">
            <DraftEditor setContent={setContent} />
          </div>
          <div onClick={createArticle}>등록</div>
        </main>
      </div>
    </>
  );
}
