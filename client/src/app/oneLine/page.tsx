"use client";

import { SideBar } from "@/src/components/sideBar";
import { isExpired } from "@/src/hooks/isExpired";
import LocalStorage from "@/src/hooks/localStorage";
import { maskUsername } from "@/src/hooks/maskUsername";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function OneLine() {
  const [content, setContent] = useState("");
  let accessToken = LocalStorage.getItem("accessToken");

  const queryClient = useQueryClient();

  const fetchOneLines = async () => {
    const response = await fetch(`http://localhost:5000/api/oneLines`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();

    return data.data;
  };
  const { data: oneLines, isLoading } = useQuery({
    queryKey: ["oneLines"],
    queryFn: fetchOneLines,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:5000/api/oneLines", {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
        credentials: "include",
      });
      if (!response.ok) {
        console.log(response.json());
        throw new Error("Network response was not ok");
      }
      const fetchData = await response.json();
      console.log(fetchData);
    },
    onError: (error) => {
      console.error("Review creation error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["oneLines"],
      });
    },
  });
  const createComment = async () => {
    if (!content || content.trim() === "") {
      alert("내용을 입력해주세요");
      return;
    }

    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");

    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      return;
    }

    setContent("");
  };

  return (
    <div>
      <SideBar />
      <div className="ml-52 flex h-screen justify-center bg-blue-300 pt-20">
        <main className="flex w-1/2 flex-col bg-slate-400 p-10">
          <section className="mb-6">
            <h3 className="text-2xl">한줄 책 추천</h3>
            <div>
              <textarea
                onChange={(e) => setContent(e.target.value)}
                value={content}
                className="my-5 h-20 w-full resize-none rounded-md p-2 focus:outline-none"
              />
              <div onClick={createComment}>등록</div>
            </div>
          </section>
          <section>
            <ul>
              {oneLines &&
                oneLines.map((oneLine: IOneLine, index: number) => (
                  <li className="mb-3 py-2" key={index}>
                    <div className="flex flex-col ">
                      <span className="mb-2 text-sm opacity-35">
                        {oneLine.author.nickname} (
                        {maskUsername(oneLine.author.username)})
                      </span>
                      <span>{oneLine.content}</span>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
