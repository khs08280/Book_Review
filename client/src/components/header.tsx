"use client";

import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isExpired } from "../hooks/isExpired";
import LocalStorage from "../hooks/localStorage";

export function Header() {
  const [isLoggedIn, setClientExampleState] = useState("");
  const [exampleState, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const router = useRouter();
  useEffect(() => {
    setClientExampleState(exampleState);
  }, [exampleState]);

  const accessToken = LocalStorage.getItem("accessToken");

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const expired = await isExpired(accessToken);

    try {
      if (!accessToken || expired) {
        console.log("만료되었거나 유효하지 않은 토큰입니다.");
        return;
      }
      const response = await fetch("http://localhost:5000/api/users/logout", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        method: "POST",
      });
      if (response.status === 200) {
        setIsLoggedIn(false);
        router.push("/");
      } else {
        console.error("로그아웃 실패:", response.statusText);
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };
  return (
    <header className="bg-light-lighter dark:bg-dark-darker flex max-w-full justify-between px-8 py-5 items-center shadow sticky top-0 ">
      <Link href={"/"}>
        <h1 className=" text-3xl ">BOOX</h1>
      </Link>
      <div className="flex max-w-fit items-center ">
        <IoSearch className=" size-6" />

        {isLoggedIn ? (
          <button
            className="py-2 p-4 transition-colors rounded text-white bg-green-500 hover:bg-green-600 text-lg ml-10"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        ) : (
          <Link href={"/login"}>
            <button className="py-2 p-4 transition-colors rounded text-white bg-green-500 hover:bg-green-600 text-lg ml-10">
              로그인
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
