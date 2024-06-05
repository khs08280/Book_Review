"use client";

import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isExpired } from "../hooks/isExpired";
import LocalStorage from "../hooks/localStorage";
import { AnimatePresence, motion } from "framer-motion";
import { FaUser, FaUserCircle } from "react-icons/fa";

export function Header() {
  const [isLoggedIn, setClientExampleState] = useState(false);
  const [exampleState, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
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
      if (!response.ok) {
        console.log(response.json());
        console.error("로그아웃 실패:", response.statusText);
      }
      LocalStorage.removeItem("accessToken");
      LocalStorage.removeItem("loggedUserData");
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };
  const searchClick = () => {
    setIsSearchOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSearch = (e: any) => {
    e.preventDefault();
    if (searchText.length < 2) {
      alert("검색어는 2글자 이상이어야 합니다.");
    } else {
      router.push(`/search?searchText=${searchText}`);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex max-w-full items-center justify-between bg-light-lighter px-8 py-5 shadow dark:bg-dark-darker">
      <Link href={"/"}>
        <h1 className=" text-3xl ">BOOX</h1>
      </Link>
      <div className="flex max-w-fit items-center ">
        <div className="flex items-center" ref={searchRef}>
          <IoSearch onClick={searchClick} className=" size-6 cursor-pointer" />
          <AnimatePresence>
            {isSearchOpen && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-2"
                onSubmit={handleSearch}
              >
                <input
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  className="h-7 w-full rounded-md border border-solid border-black pl-2 focus:outline-green-400"
                />
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        {isLoggedIn ? (
          <>
            <button
              className="ml-10 rounded bg-green-500 p-4 py-2 text-lg text-white transition-colors hover:bg-green-600"
              onClick={handleLogout}
            >
              로그아웃
            </button>
            <Link href={"/profile"}>
              <div>
                <FaUserCircle className="ml-5 size-10" />
              </div>
            </Link>
          </>
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
