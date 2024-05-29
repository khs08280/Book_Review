"use client";
import { CiMenuKebab } from "react-icons/ci";
import { formatDate } from "../hooks/checkDate";
import { maskUsername } from "../hooks/maskUsername";
import React, { useEffect, useRef, useState } from "react";
import useClickOutside from "../hooks/outsideClick";
import { getUserId } from "../hooks/isExpired";
import LocalStorage from "../hooks/localStorage";
import jwt, { JwtPayload } from "jsonwebtoken";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const accessToken = LocalStorage.getItem("accessToken");
  const { userId } = jwt.decode(accessToken || "") as JwtPayload;

  const openMenuClick = (event: any) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  useClickOutside(divRef, () => {
    setIsMenuOpen(false);
  });
  const deleteCommentClick = (commentId: string) => {
    const check = confirm("삭제 하시겠습니까?");
    if (check) deleteComment(commentId);
  };

  return (
    <div className="mb-4 border-b-2 border-solid border-black border-opacity-5 pb-4">
      <div className="flex w-full items-center justify-between">
        <div className="mb-4">
          <span className="mr-2">
            {comment.author.nickname} ({maskUsername(comment.author.username)})
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
          {userId == comment.author._id && (
            <div className="relative">
              <CiMenuKebab
                onClick={openMenuClick}
                className="size-5 cursor-pointer"
              />
              {isMenuOpen && (
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
              setIsCommentOpen(false);
            }}
            className=" mt-2 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            등록
          </button>
        </div>
      )}
    </div>
  );
}
