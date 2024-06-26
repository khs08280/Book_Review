import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { formatDate } from "../hooks/checkDate";
import { maskUsername } from "../hooks/maskUsername";
import { CiMenuKebab } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { isExpired } from "../hooks/isExpired";
import LocalStorage from "../hooks/localStorage";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import useClickOutside from "../hooks/outsideClick";

interface ReCommentItemProps {
  reComment: IReComment;
  userId: string | null;
  accessToken: string | null;
  openReCommentMenuClick: (commentId: string, content: string) => void;
  isMenuOpen: boolean;
  selectedCommentId: string;
  isSelectedReCommentOpen: boolean;
  setIsSelectedReCommentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCommentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReCommentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCommentClick: (commentId: string) => void;
  setSelectedReCommentContent: React.Dispatch<React.SetStateAction<string>>;
  selectedReCommentContent: string;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  updateComment: (commentId: string, content: string) => void;
}

export default function CommunityReCommentItem({
  reComment,
  userId,
  accessToken,
  openReCommentMenuClick,
  isMenuOpen,
  setIsMenuOpen,
  selectedCommentId,
  isSelectedReCommentOpen,
  setIsSelectedReCommentOpen,
  setIsCommentOpen,
  setIsReCommentOpen,
  deleteCommentClick,
  setSelectedReCommentContent,
  selectedReCommentContent,
  updateComment,
}: ReCommentItemProps) {
  const [reviewLikes, setReviewLikes] = useState<{ [key: string]: number }>({});
  const [isLikeClicked, setIsLikeClicked] = useState<{
    [key: string]: boolean;
  }>({});
  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reComment) {
      const initialReviewLikes: { [key: string]: number } = {};
      const initialIsLikeClicked: { [key: string]: boolean } = {};

      initialReviewLikes[reComment._id] = reComment.likes.length;
      initialIsLikeClicked[reComment._id] = reComment.likes.includes(
        userId as never,
      );
      setReviewLikes(initialReviewLikes);
      setIsLikeClicked(initialIsLikeClicked);
    }
  }, [reComment]);
  useClickOutside(divRef, () => {
    setIsMenuOpen(false);
  });

  const handleLike = async (commentId: string) => {
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
        "https://bookreviewserver.shop/api/comments/handleLike",
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

  return (
    <div
      key={reComment._id}
      className="mb-4 ml-7 border-b-2 border-solid border-black border-opacity-5 pb-2"
    >
      <div className="flex w-full items-center justify-between">
        <div className="mb-4 text-black text-opacity-35 dark:text-light-light dark:text-opacity-20">
          <span className="mr-2">
            {reComment.author.nickname} (
            {maskUsername(reComment.author.username)})
          </span>
          {reComment.modifiedAt ? (
            <span>{formatDate(reComment.modifiedAt)} (수정됨)</span>
          ) : (
            <span>{formatDate(reComment.createdAt)}</span>
          )}
        </div>
        <div className="flex items-center">
          {isLikeClicked[reComment._id] ? (
            <AiFillLike
              onClick={() => handleLike(reComment._id)}
              className=" size-5 cursor-pointer text-white"
            />
          ) : (
            <AiOutlineLike
              onClick={() => handleLike(reComment._id)}
              className=" size-5 cursor-pointer"
            />
          )}
          <span>{reviewLikes[reComment._id]}</span>
          {userId == reComment.author._id && (
            <div key={reComment._id} className="relative">
              <CiMenuKebab
                onClick={() =>
                  openReCommentMenuClick(reComment._id, reComment.content)
                }
                className="size-5 cursor-pointer"
              />
              {isMenuOpen && selectedCommentId === reComment._id && (
                <div
                  ref={divRef}
                  className="absolute left-0 top-6 z-10 flex w-16 flex-col items-center justify-center rounded-sm bg-light-light p-2 shadow-lg"
                >
                  {isSelectedReCommentOpen ? (
                    <span
                      onClick={() => setIsSelectedReCommentOpen(false)}
                      className="mb-2 cursor-pointer text-center text-red-500"
                    >
                      취소
                    </span>
                  ) : (
                    <span
                      onClick={() => {
                        setIsSelectedReCommentOpen(true);
                        setIsCommentOpen(false);
                        setIsReCommentOpen(false);
                      }}
                      className="mb-2 cursor-pointer text-center text-blue-500"
                    >
                      수정
                    </span>
                  )}
                  <span
                    onClick={() => deleteCommentClick(reComment._id)}
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
      <div className="mb-2">{reComment.content}</div>
      {isSelectedReCommentOpen && selectedCommentId === reComment._id && (
        <div className="ml-12 mt-4 flex flex-col items-end rounded-md border-solid bg-light-light p-4 shadow-md dark:border-2 dark:border-light-light dark:border-opacity-20 dark:bg-dark-dark">
          <textarea
            onChange={(e) => setSelectedReCommentContent(e.target.value)}
            value={selectedReCommentContent}
            className="h-24 w-full resize-none rounded-md border border-gray-300 bg-light-light p-2 focus:border-blue-500 focus:outline-none dark:border-opacity-20 dark:bg-dark-dark"
          />
          <button
            onClick={() => {
              updateComment(reComment._id, selectedReCommentContent);
              setIsSelectedReCommentOpen(false);
            }}
            className=" mt-2 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
}
