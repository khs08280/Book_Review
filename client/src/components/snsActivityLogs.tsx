"use client";
import { useQuery } from "@tanstack/react-query";
import LocalStorage from "../hooks/localStorage";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useEffect } from "react";
import { isExpired } from "../hooks/isExpired";
import { maskUsername } from "../hooks/maskUsername";
import { FaUserCircle } from "react-icons/fa";
import { formatDate } from "../hooks/checkDate";
import { PiArrowElbowDownRightBold } from "react-icons/pi";

export default function SnsActivityLogs() {
  let accessToken = LocalStorage.getItem("accessToken");

  useEffect(() => {
    const fetch = async () => {
      const expired = await isExpired(accessToken);
      if (expired || !accessToken) {
        console.log("토큰이 이상합니다");
        return;
      }
      accessToken = LocalStorage.getItem("accessToken");
    };

    fetch();
  }, []);

  const fetchData = async () => {
    const response = await fetch(`http://localhost:5000/api/activityLogs`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    const data = await response.json();
    console.log(data.data);
    return data.data;
  };

  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ["activityLogs"],
    queryFn: fetchData,
  });

  return (
    <>
      {activityLogs &&
        activityLogs.map((activityLog: IActivityLog) => (
          <div
            className=" mb-5 flex w-full flex-col justify-between rounded-md border-2 border-solid border-white p-5"
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
              <span>{activityLog.description}</span>
              <div className="my-3 ml-2 flex items-center">
                <PiArrowElbowDownRightBold className="size-5" />
                <span className=" ml-2 w-full rounded-md border-2 border-solid border-white bg-green-400 px-3 py-2">
                  {activityLog.metadata.content}
                </span>
              </div>
            </div>
            <div>조하요</div>
          </div>
        ))}
    </>
  );
}
