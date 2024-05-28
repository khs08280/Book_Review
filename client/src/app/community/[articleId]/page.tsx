"use client";

import CommunityNav from "@/src/components/communityNav";
import CommunityReviewItem from "@/src/components/communityReviewItem";
import { SideBar } from "@/src/components/sideBar";
import { isExpired } from "@/src/hooks/isExpired";
import LocalStorage from "@/src/hooks/localStorage";
import { maskUsername } from "@/src/hooks/maskUsername";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditorState, convertFromRaw } from "draft-js";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";

export default function ArticlePage() {
  const [commentContent, setCommentContent] = useState("");
  const [isOpenInput, setIsOpenInput] = useState(false);
  const params = useParams();
  const queryClient = useQueryClient();
  let accessToken = LocalStorage.getItem("accessToken");

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

    data.data.content = convertJsonToText(data.data.content);
    return data.data;
  };
  const { data: article, isLoading } = useQuery<IArticle>({
    queryKey: ["article", params.articleId],
    queryFn: fetchData,
  });
  const data = {
    content: commentContent,
    articleId: article?._id,
  };
  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        body: JSON.stringify(data),
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
        queryKey: ["article", params.articleId],
      });
    },
  });
  const createComment = async () => {
    if (commentContent == "") {
      alert("내용을 입력해주세요");
      return;
    }
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");

    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      return;
    }

    await createMutation.mutateAsync();
    setCommentContent("");
  };

  const convertJsonToText = (rawContentStateJson: string) => {
    const rawContentState = JSON.parse(rawContentStateJson);

    const contentState = convertFromRaw(rawContentState);

    const editorState = EditorState.createWithContent(contentState);

    const plainText = contentState.getPlainText();

    return plainText;
  };

  return (
    <>
      <SideBar />
      <div className="ml-52 flex justify-center p-10">
        {article && (
          <main className="h-screen w-7/12 bg-slate-500 p-10">
            <CommunityNav />
            <section className=" border-b-2 border-solid border-black border-opacity-5 pb-10">
              <div className="mb-4 flex items-center">
                <span className=" mr-2 rounded-lg bg-green-400 p-2 text-base">
                  카테고리
                </span>
                <span className="text-2xl font-medium">{article.title}</span>
              </div>
              <div className="flex justify-start text-sm opacity-35">
                <span className="mr-3">
                  {article.author.nickname} (
                  {maskUsername(article.author.username)})
                </span>
                <span className="mr-3">{article.content}</span>
                <span className="mr-3 flex items-center">
                  <FaRegEye className="mr-1" /> {article.view}
                </span>
                <span className="flex items-center ">
                  <AiOutlineLike className="mr-1" />
                  {article.likes?.length}
                </span>
              </div>
            </section>
            <section className="my-16">
              <span>{article.content}</span>
            </section>
            <div className="mt-32 flex flex-col items-center">
              <AiOutlineLike />
              좋아요
            </div>
            <section className="my-10">
              <h2 className="mb-5 text-xl font-semibold">댓글</h2>
              {article.comments.map((comment: IComment) => (
                <CommunityReviewItem
                  key={comment._id}
                  isOpenInput={isOpenInput}
                  setIsOpenInput={setIsOpenInput}
                  comment={comment}
                />
              ))}

              <div className="flex h-32 w-full items-center bg-light-light p-2">
                <textarea
                  onChange={(e) => setCommentContent(e.target.value)}
                  value={commentContent}
                  className=" h-full w-full resize-none bg-light-light focus:outline-none"
                  placeholder="댓글을 작성해주세요"
                />
                <div
                  onClick={createComment}
                  className="min-w-fit rounded-md bg-blue-200 p-5 px-10"
                >
                  등록
                </div>
              </div>
            </section>
          </main>
        )}
      </div>
    </>
  );
}
