"use client";

import DraftEditor from "@/src/components/draftEditor";
import Footer from "@/src/components/footer";
import { SideBar } from "@/src/components/sideBar";
import { isExpired } from "@/src/hooks/isExpired";
import LocalStorage from "@/src/hooks/localStorage";
import { isLoggedInAtom } from "@/src/states/atoms";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

export default function CommunityWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("자유");
  let accessToken = LocalStorage.getItem("accessToken");
  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);

  const router = useRouter();

  const createArticle = async () => {
    const fetchData = {
      title,
      content,
      category,
    };
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      setIsLoggedIn(false);
      LocalStorage.removeItem("accessToken");
      router.push("/login");
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
    router.push(`/community/article/${data.data._id}`);
  };

  return (
    <>
      <SideBar />
      <div className="ml-52 flex justify-center p-10">
        <main className="flex h-screen w-7/12 flex-col space-y-4 bg-slate-500 p-5">
          <span className="mb-4 text-2xl text-white">글 쓰기</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={"자유"}>자유</option>
            <option value={"인문"}>인문</option>
            <option value={"자기계발"}>자기계발</option>
            <option value={"소설"}>소설</option>
            <option value={"웹툰"}>웹툰</option>
            <option value={"웹소설"}>웹소설</option>
            <option value={"자유"}>자유</option>
          </select>
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
      <Footer />
    </>
  );
}
