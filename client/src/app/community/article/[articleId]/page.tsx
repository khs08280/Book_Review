"use client";

import CommunityNav from "@/src/components/communityNav";
import CommunityReviewItem from "@/src/components/communityCommentItem";
import { SideBar } from "@/src/components/sideBar";
import { isExpired } from "@/src/hooks/isExpired";
import LocalStorage from "@/src/hooks/localStorage";
import { maskUsername } from "@/src/hooks/maskUsername";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditorState, convertFromRaw } from "draft-js";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CiMenuKebab } from "react-icons/ci";
import useClickOutside from "@/src/hooks/outsideClick";
import Link from "next/link";
import { formatDate } from "@/src/hooks/checkDate";

export default function ArticlePage() {
  const [commentContent, setCommentContent] = useState("");
  const [isOpenInput, setIsOpenInput] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reviewLikes, setReviewLikes] = useState<{ [key: string]: number }>({});
  const [isLikeClicked, setIsLikeClicked] = useState<{
    [key: string]: boolean;
  }>({});

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const params = useParams();
  const queryClient = useQueryClient();
  let accessToken = LocalStorage.getItem("accessToken");
  const { userAtom } = JSON.parse(
    LocalStorage.getItem("loggedUserData") as string,
  );
  const userId = userAtom._id;

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

  const createMutation = useMutation({
    mutationFn: async (data: {
      content: string;
      articleId: string | undefined;
      parentCommentId?: string;
    }) => {
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
  const createComment = async (
    articleId: string,
    content: string,
    parentCommentId?: string,
  ) => {
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

    const data = {
      content,
      articleId,
      parentCommentId,
    };

    await createMutation.mutateAsync(data);
    setCommentContent("");
  };
  const updateMutation = useMutation({
    mutationFn: async (theData: { commentId: string; content: string }) => {
      const response = await fetch(`http://localhost:5000/api/comments/`, {
        method: "PATCH",
        body: JSON.stringify(theData),
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
  useClickOutside(divRef, () => {
    setIsMenuOpen(false);
  });

  const updateComment = async (commentId: string, content: string) => {
    if (content == "") {
      alert("내용을 입력해주세요");
      return;
    }
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");

    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      return;
    }
    updateMutation.mutate({ commentId, content });
  };

  const deleteCommentMutation = useMutation({
    mutationFn: async (theData: { commentId: string }) => {
      const response = await fetch(`http://localhost:5000/api/comments/`, {
        method: "DELETE",
        body: JSON.stringify(theData),
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

  const deleteComment = async (commentId: string) => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");

    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      return;
    }
    deleteCommentMutation.mutate({ commentId });
  };

  const deleteArticle = async (articleId: string) => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");

    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      return;
    }
    const check = confirm("삭제 하시겠습니까?");
    if (check) {
      const response = await fetch(`http://localhost:5000/api/articles/`, {
        method: "DELETE",
        body: JSON.stringify({ articleId }),
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
      router.push("/community");
    }
  };

  const convertJsonToText = (rawContentStateJson: string) => {
    const rawContentState = JSON.parse(rawContentStateJson);

    const contentState = convertFromRaw(rawContentState);

    const editorState = EditorState.createWithContent(contentState);

    const plainText = contentState.getPlainText();

    return plainText;
  };

  const handleLike = async (articleId: string) => {
    const expired = await isExpired(accessToken);
    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      return;
    }
    accessToken = LocalStorage.getItem("accessToken");
    try {
      const response = await fetch(
        "http://localhost:5000/api/articles/handleLike",
        {
          method: "POST",
          body: JSON.stringify({ articleId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          mode: "cors",
          credentials: "include",
        },
      );
      if (!response.ok) {
        console.error("서버 쪽에 문제가 생김");
      }

      const responseData = await response.json();
      setIsLikeClicked((prevState) => ({
        ...prevState,
        [articleId]: !prevState[articleId],
      }));
      setReviewLikes((prevState) => ({
        ...prevState,
        [articleId]: responseData.likes,
      }));
      console.log(responseData);
    } catch (error) {
      console.error("좋아요 오류:", error);
      throw error;
    }
  };
  useEffect(() => {
    if (article) {
      const initialReviewLikes: { [key: string]: number } = {};
      const initialIsLikeClicked: { [key: string]: boolean } = {};

      initialReviewLikes[article._id] = article.likes.length;
      initialIsLikeClicked[article._id] = article.likes.includes(
        userId as never,
      );
      setReviewLikes(initialReviewLikes);
      setIsLikeClicked(initialIsLikeClicked);
    }
  }, [article]);

  const userMenuOpen = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleFollow = async () => {
    const response = await fetch(
      `http://localhost:5000/api/users/follow/${article?.author._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
        credentials: "include",
      },
    );
    if (!response.ok) {
      console.log(response.json());
      throw new Error("Network response was not ok");
    }
    const fetchData = await response.json();
    console.log(fetchData);
  };

  return (
    <>
      <SideBar />
      <div className="ml-52 flex justify-center p-10">
        {article && (
          <main className=" w-7/12 bg-slate-500 p-10">
            <CommunityNav />
            <section className=" border-b-2 border-solid border-black border-opacity-5 pb-10">
              <div className="flex  justify-between">
                <div className="mb-4 flex items-center">
                  {article.category ? (
                    <span className=" mr-2 rounded-lg bg-green-400 p-1 text-base">
                      {article.category}
                    </span>
                  ) : (
                    <span className=" mr-2 rounded-lg bg-green-400 p-2 text-base">
                      자유
                    </span>
                  )}
                  <span className="text-2xl font-medium">{article.title}</span>
                </div>
                {userId == article.author._id && (
                  <div className="relative">
                    <CiMenuKebab
                      onClick={() => setIsMenuOpen((prev) => !prev)}
                      className="size-5 cursor-pointer"
                    />
                    {isMenuOpen && (
                      <div
                        ref={divRef}
                        className="absolute left-0 top-6 z-10 flex w-16 flex-col items-center justify-center rounded-sm bg-light-light p-2 shadow-lg"
                      >
                        <Link href={`/community/article/${article._id}/update`}>
                          <span className="mb-2 cursor-pointer text-center text-blue-500">
                            수정
                          </span>
                        </Link>
                        <span
                          onClick={() => deleteArticle(article._id)}
                          className="cursor-pointer text-center text-red-500"
                        >
                          삭제
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-start text-sm ">
                <div className="relative">
                  <span
                    onClick={userMenuOpen}
                    className="mr-3 cursor-pointer opacity-35"
                  >
                    {article.author.nickname} (
                    {maskUsername(article.author.username)})
                  </span>
                  {isUserMenuOpen && userId !== article.author._id && (
                    <div
                      onClick={handleFollow}
                      className="absolute left-5 z-10 cursor-pointer rounded-md bg-light-light p-2 text-base opacity-100"
                    >
                      팔로우
                    </div>
                  )}
                </div>

                <span className="mr-3 opacity-35">
                  {formatDate(article.createdAt)}
                </span>
                <span className="mr-3 flex items-center opacity-35">
                  <FaRegEye className="mr-1" /> {article.view}
                </span>
                <span className="flex items-center opacity-35 ">
                  <AiOutlineLike className="mr-1" />

                  {article.likes?.length}
                </span>
              </div>
            </section>
            <section className="my-16">
              <span>{article.content}</span>
            </section>
            <div className="mt-32 flex w-full flex-col items-center ">
              <div
                onClick={() => handleLike(article._id)}
                className="flex w-fit cursor-pointer flex-col items-center rounded-xl border-2 border-solid border-black border-opacity-20 p-4 px-6"
              >
                {isLikeClicked[article._id] ? (
                  <AiFillLike className=" size-5 cursor-pointer text-white" />
                ) : (
                  <AiOutlineLike className=" size-5 cursor-pointer" />
                )}
                <span className="my-1">좋아요</span>
                <span>{reviewLikes[article._id]}</span>
              </div>
            </div>
            <section className="my-10">
              <h2 className="mb-5 text-xl font-semibold">댓글</h2>
              {article.comments.map((comment: IComment) => (
                <CommunityReviewItem
                  articleId={article._id}
                  createComment={createComment}
                  deleteComment={deleteComment}
                  updateComment={updateComment}
                  key={comment._id}
                  isOpenInput={isOpenInput}
                  setIsOpenInput={setIsOpenInput}
                  comment={comment}
                />
              ))}

              <div className=" flex flex-col items-end rounded-md bg-light-light p-4 shadow-md">
                <textarea
                  onChange={(e) => setCommentContent(e.target.value)}
                  value={commentContent}
                  className=" h-24 w-full resize-none rounded-md border border-gray-300 bg-light-light p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="댓글을 작성해주세요"
                />
                <div
                  onClick={() => createComment(article._id, commentContent)}
                  className="mt-2 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
