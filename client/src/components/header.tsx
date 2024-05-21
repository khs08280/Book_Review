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
  const [isLoggedIn, setClientExampleState] = useState(false);
  const [exampleState, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setClientExampleState(exampleState);
  }, [exampleState]);

  let accessToken = LocalStorage.getItem("accessToken");

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const expired = await isExpired(accessToken);

    try {
      if (!accessToken || expired) {
        console.log("만료되었거나 유효하지 않은 토큰입니다.");
        return;
      }
      accessToken = LocalStorage.getItem("accessToken");

      const response = await fetch("http://localhost:5000/api/users/logout", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        method: "POST",
      });
      if (response.status === 200) {
        LocalStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        router.push("/");
      } else {
        console.log(response.json());
        console.error("로그아웃 실패:", response.statusText);
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };
  const searchClick = () => {
    setIsSearchOpen((prev) => !prev);
  };
  return (
    <header className="sticky top-0 z-10 flex max-w-full items-center justify-between bg-light-lighter px-8 py-5 shadow dark:bg-dark-darker">
      <Link href={"/"}>
        <h1 className=" text-3xl ">BOOX</h1>
      </Link>
      <div className="flex max-w-fit items-center ">
        <IoSearch onClick={searchClick} className=" size-6 cursor-pointer" />
        {isSearchOpen ? (
          <input className="border border-solid border-y-black" />
        ) : null}
        {isLoggedIn ? (
          <button
            className="ml-10 rounded bg-green-500 p-4 py-2 text-lg text-white transition-colors hover:bg-green-600"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        ) : (
          <Link href={"/login"}>
            <button className="ml-10 rounded bg-green-500 p-4 py-2 text-lg text-white transition-colors hover:bg-green-600">
              로그인
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
