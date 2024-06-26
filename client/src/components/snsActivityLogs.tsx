"use client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import LocalStorage from "../hooks/localStorage";
import { useEffect, useState } from "react";
import { isExpired } from "../hooks/isExpired";
import { maskUsername } from "../hooks/maskUsername";
import { FaUserCircle } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import { convertJsonToText } from "../hooks/convertToPlainText";
import SnsLoading from "../app/sns/loading";
import { formatDate } from "../hooks/checkDate";
import SnsAllLoading from "../app/sns/loading";

export default function SnsActivityLogs() {
  let accessToken = LocalStorage.getItem("accessToken");
  const [reviewLikes, setReviewLikes] = useState<{ [key: string]: number }>({});
  const [isLikeClicked, setIsLikeClicked] = useState<{
    [key: string]: boolean;
  }>({});
  const [userId, setUserId] = useState("");
  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);

  const router = useRouter();

  const handleLike = async (referenceId: string, type: string) => {
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
        "https://bookreviewserver.shop/api/activityLogs/handleLike",
        {
          method: "POST",
          body: JSON.stringify({ referenceId, type }),
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
        [referenceId]: !prevState[referenceId],
      }));
      setReviewLikes((prevState) => ({
        ...prevState,
        [referenceId]: responseData.likes,
      }));
      console.log(responseData);
    } catch (error) {
      console.error("좋아요 오류:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loggedUserData = LocalStorage.getItem("loggedUserData");
    if (loggedUserData) {
      const { userAtom } = JSON.parse(loggedUserData);
      setUserId(userAtom._id);
    } else {
      router.push("/login");
      return;
    }
  }, []);

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
    const response = await fetch(
      `https://bookreviewserver.shop/api/activityLogs`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      },
    );
    const data = await response.json();
    console.log(data.data);
    return data.data;
  };

  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ["activityLogs"],
    queryFn: fetchData,
  });

  useEffect(() => {
    if (activityLogs && userId) {
      const initialReviewLikes: { [key: string]: number } = {};
      const initialIsLikeClicked: { [key: string]: boolean } = {};

      activityLogs.forEach((activityLog: IActivityLog) => {
        const referenceId = activityLog.referenceId;
        const likes = activityLog.metadata.likes || [];

        initialReviewLikes[referenceId] = likes.length;
        initialIsLikeClicked[referenceId] = likes.includes(userId);
      });
      setReviewLikes(initialReviewLikes);
      setIsLikeClicked(initialIsLikeClicked);
    }
  }, [activityLogs, userId]);

  if (isLoading) {
    return <SnsLoading />;
  }

  if (activityLogs.length == 0) {
    return (
      <div className=" mb-5 flex w-full justify-center   p-5 py-20 dark:border-opacity-20">
        <div className="flex flex-col items-center text-2xl">
          <span>
            팔로잉 하고 있는 유저가 없거나 1주일 동안 활동한 친구가 없어요
          </span>
          <span>커뮤니티에서 소식을 받고 싶은 유저를 팔로우하세요.</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {activityLogs &&
        activityLogs.map((activityLog: IActivityLog) => (
          <div
            className=" mb-5 flex w-full flex-col justify-between rounded-md border-2 border-solid border-white p-5 dark:border-opacity-20"
            key={activityLog._id}
          >
            <div className="mb-5 flex items-center">
              <FaUserCircle className="mr-3 size-10" />
              <div className="flex flex-col">
                <span>
                  {activityLog.author.nickname} (
                  {maskUsername(activityLog.author.username)})
                </span>
                <span className="text-sm opacity-35">
                  {formatDate(activityLog.createdAt)}
                </span>
              </div>
            </div>
            <div className="mb-5 flex flex-col ">
              <span className=" text-black text-opacity-35 dark:text-light-light dark:text-opacity-30">
                {activityLog.description}
              </span>
              <div className="my-3 flex items-center">
                {activityLog.type === "ONE_LINE" && (
                  <span className=" w-full rounded-md">
                    {activityLog.metadata.content}
                  </span>
                )}
                {activityLog.type === "POST" && (
                  <span className="flex w-full flex-col rounded-md">
                    <span className="mb-3 text-2xl">
                      {activityLog.metadata.title}
                    </span>
                    <span className="">
                      {convertJsonToText(activityLog.metadata.content)}
                    </span>
                  </span>
                )}
                {activityLog.type === "COMMENT" && (
                  <span className=" ml-2 w-full rounded-md">
                    {activityLog.metadata.content}
                  </span>
                )}
              </div>
            </div>
            <div
              onClick={() =>
                handleLike(activityLog.referenceId, activityLog.type)
              }
              className="flex w-fit cursor-pointer items-center rounded-md border-2 border-solid border-white p-2 px-4 dark:border-opacity-20"
            >
              {isLikeClicked[activityLog.referenceId] ? (
                <AiFillLike className=" size-5 cursor-pointer text-white" />
              ) : (
                <AiOutlineLike className=" size-5 cursor-pointer" />
              )}
              <span className="ml-2">
                {reviewLikes[activityLog.referenceId]}
              </span>
            </div>
          </div>
        ))}
    </>
  );
}
