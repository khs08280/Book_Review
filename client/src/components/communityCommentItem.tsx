"use client";
import { CiMenuKebab } from "react-icons/ci";
import { formatDate } from "../hooks/checkDate";
import { maskUsername } from "../hooks/maskUsername";
import React, { useEffect, useRef, useState } from "react";
import useClickOutside from "../hooks/outsideClick";
import { getUserId, isExpired } from "../hooks/isExpired";
import LocalStorage from "../hooks/localStorage";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import CommunityReCommentItem from "./communityReCommentItem";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";

interface CommentProps {
  comment: IComment;
  isOpenInput: boolean;
  createComment: any;
  articleId: string;
  deleteComment: (commentId: string) => void;
  updateComment: (commentId: string, newContent: string) => void;
  setIsOpenInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommunityReviewItem({
  comment,
  isOpenInput,
  updateComment,
  articleId,
  deleteComment,
  createComment,
  setIsOpenInput,
}: CommentProps) {
  const [commentContent, setCommentContent] = useState(comment.content);
  const [reCommentContent, setReCommentContent] = useState("");

  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isReCommentOpen, setIsReCommentOpen] = useState(false);
  const [isSelectedReCommentOpen, setIsSelectedReCommentOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [reviewLikes, setReviewLikes] = useState<{ [key: string]: number }>({});
  const [isLikeClicked, setIsLikeClicked] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);

  const [selectedCommentId, setSelectedCommentId] = useState("");
  const [selectedReCommentContent, setSelectedReCommentContent] = useState("");

  const divRef = useRef<HTMLDivElement>(null);
  let accessToken = LocalStorage.getItem("accessToken");
  const { userAtom } = JSON.parse(
    LocalStorage.getItem("loggedUserData") as string,
  );
  const userId = userAtom._id;

  const openMenuClick = (commentId: string) => {
    setIsMenuOpen((prev) => !prev);
    setSelectedCommentId(commentId);
  };

  const openReCommentMenuClick = (
    reCommentId: string,
    reCommentContent: string,
  ) => {
    setIsMenuOpen((prev) => !prev);
    setSelectedCommentId(reCommentId);
    setSelectedReCommentContent(reCommentContent);
    setIsReCommentOpen(false);
  };

  useClickOutside(divRef, () => {
    setIsMenuOpen(false);
  });

  const deleteCommentClick = (commentId: string) => {
    const check = confirm("삭제 하시겠습니까?");
    if (check) deleteComment(commentId);
  };

  const handleLike = async (commentId: string) => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken) {
      console.log("액세스 토큰이 올바르지 않습니다");
      return;
    }
    if (expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      setIsLoggedIn(false);
      LocalStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }
    accessToken = LocalStorage.getItem("accessToken");
    try {
      const response = await fetch(
        "http://localhost:5000/api/comments/handleLike",
        {
          method: "POST",
          body: JSON.stringify({ commentId }),
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
        [commentId]: !prevState[commentId],
      }));
      setReviewLikes((prevState) => ({
        ...prevState,
        [commentId]: responseData.likes,
      }));
      console.log(responseData);
    } catch (error) {
      console.error("좋아요 오류:", error);
      throw error;
    }
  };
  useEffect(() => {
    if (comment) {
      const initialReviewLikes: { [key: string]: number } = {};
      const initialIsLikeClicked: { [key: string]: boolean } = {};

      initialReviewLikes[comment._id] = comment.likes.length;
      initialIsLikeClicked[comment._id] = comment.likes.includes(
        userId as never,
      );
      setReviewLikes(initialReviewLikes);
      setIsLikeClicked(initialIsLikeClicked);
    }
  }, [comment]);

  return (
    <div>
      <div className="mb-4 border-b-2 border-solid border-black border-opacity-5 pb-2">
        <div className="flex w-full items-center justify-between">
          <div className="mb-4">
            <span className="mr-2">
              {comment.author.nickname} ({maskUsername(comment.author.username)}
              )
            </span>
            <span>{formatDate(comment.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <span
              onClick={() => {
                setIsReCommentOpen((prev) => !prev);
                setIsCommentOpen(false);
              }}
              className="mr-2 cursor-pointer text-sm"
            >
              답글
            </span>
            {isLikeClicked[comment._id] ? (
              <AiFillLike
                onClick={() => handleLike(comment._id)}
                className=" size-5 cursor-pointer text-white"
              />
            ) : (
              <AiOutlineLike
                onClick={() => handleLike(comment._id)}
                className=" size-5 cursor-pointer"
              />
            )}
            <span>{reviewLikes[comment._id]}</span>
            {userId == comment.author._id && (
              <div className="relative">
                <CiMenuKebab
                  onClick={() => openMenuClick(comment._id)}
                  className="size-5 cursor-pointer"
                />
                {isMenuOpen && selectedCommentId === comment._id && (
                  <div
                    ref={divRef}
                    className="absolute left-0 top-6 z-10 flex w-16 flex-col items-center justify-center rounded-sm bg-light-light p-2 shadow-lg"
                  >
                    {isCommentOpen ? (
                      <span
                        onClick={() => setIsCommentOpen(false)}
                        className="mb-2 cursor-pointer text-center text-red-500"
                      >
                        취소
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          setIsCommentOpen(true);
                          setIsReCommentOpen(false);
                        }}
                        className="mb-2 cursor-pointer text-center text-blue-500"
                      >
                        수정
                      </span>
                    )}
                    <span
                      onClick={() => deleteCommentClick(comment._id)}
                      className="cursor-pointer text-center text-red-500"
                    >
                      삭제
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mb-2">{comment.content}</div>
        {isCommentOpen && (
          <div className="ml-12 mt-4 flex flex-col items-end rounded-md bg-light-light p-4 shadow-md">
            <textarea
              onChange={(e) => setCommentContent(e.target.value)}
              value={commentContent}
              className="h-24 w-full resize-none rounded-md border border-gray-300 bg-light-light p-2 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={() => {
                updateComment(comment._id, commentContent);
                setIsCommentOpen(false);
              }}
              className=" mt-2 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              수정
            </button>
          </div>
        )}
        {isReCommentOpen && (
          <div className="ml-12 mt-4 flex flex-col items-end rounded-md bg-light-light p-4 shadow-md">
            <textarea
              onChange={(e) => setReCommentContent(e.target.value)}
              value={reCommentContent}
              className="h-24 w-full resize-none rounded-md border border-gray-300 bg-light-light p-2 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={() => {
                createComment(articleId, reCommentContent, comment._id);
                setIsReCommentOpen(false);
                setReCommentContent("");
              }}
              className=" mt-2 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              등록
            </button>
          </div>
        )}
      </div>
      {comment.children &&
        comment.children.map((reComment: IReComment) => (
          <CommunityReCommentItem
            reComment={reComment}
            userId={userId}
            accessToken={accessToken}
            openReCommentMenuClick={openReCommentMenuClick}
            isMenuOpen={isMenuOpen}
            selectedCommentId={selectedCommentId}
            isSelectedReCommentOpen={isSelectedReCommentOpen}
            setIsSelectedReCommentOpen={setIsSelectedReCommentOpen}
            setIsCommentOpen={setIsCommentOpen}
            setIsReCommentOpen={setIsReCommentOpen}
            deleteCommentClick={deleteCommentClick}
            setSelectedReCommentContent={setSelectedReCommentContent}
            selectedReCommentContent={selectedReCommentContent}
            updateComment={updateComment}
          />
        ))}
    </div>
  );
}
