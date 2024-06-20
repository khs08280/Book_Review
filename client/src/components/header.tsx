"use client";

import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isExpired } from "../hooks/isExpired";
import LocalStorage from "../hooks/localStorage";
import { AnimatePresence, motion } from "framer-motion";
import { FaUser, FaUserCircle } from "react-icons/fa";
import DarkModeToggle from "./darkModeToggle";
import { FiMenu } from "react-icons/fi";

export function Header() {
  const [isLoggedIn, setClientExampleState] = useState(false);
  const [exampleState, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    setClientExampleState(exampleState);
  }, [exampleState]);

  let accessToken = LocalStorage.getItem("accessToken");

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
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
        router.push("/");
        return;
      }

      const response = await fetch(
        "https://bookreviewserver.shop/api/users/logout",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          method: "POST",
        },
      );
      if (!response.ok) {
        console.log(response.json());
        console.error("로그아웃 실패:", response.statusText);
      }
      LocalStorage.removeItem("accessToken");
      LocalStorage.removeItem("loggedUserData");
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
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
      setSearchText("");
      router.push(`/search?searchText=${searchText}`);
    }
  };
  const handleClick = async (href: string) => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      setIsLoggedIn(false);
      LocalStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }

    if (isLoggedIn) {
      router.push(href);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="sticky top-0 z-20">
      <header className=" flex max-w-full items-center justify-between bg-light-lighter px-8 py-5 shadow dark:bg-dark-darker dark:text-light-light dark:shadow-xl">
        <div className="flex items-center">
          <FiMenu
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
            }}
            className="mr-3 size-7 cursor-pointer lg:hidden"
          />
          <Link href="/">
            <h1 className="text-3xl">BOOX</h1>
          </Link>
        </div>
        {isLoggedIn ? (
          <FaUser
            onClick={() => {
              setIsUserMenuOpen((prev) => !prev);
            }}
            className="size-8 cursor-pointer lg:hidden"
          />
        ) : (
          <Link href="/login">
            <button className="min-w-fit rounded bg-green-500 p-4 py-2 text-lg text-white transition-colors hover:bg-green-600 lg:hidden">
              로그인
            </button>
          </Link>
        )}

        <div className="hidden max-w-fit items-center lg:flex">
          <div className="flex items-center" ref={searchRef}>
            <IoSearch onClick={searchClick} className="size-6 cursor-pointer" />
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
                    className="h-10 w-full rounded-md border border-solid border-black pl-2 focus:outline-green-400 dark:bg-dark-dark dark:text-light-light"
                  />
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          <DarkModeToggle />
          {isLoggedIn ? (
            <>
              <button
                className="ml-10 rounded bg-green-500 p-4 py-2 text-lg text-white transition-colors hover:bg-green-600 dark:bg-stone-700"
                onClick={handleLogout}
              >
                로그아웃
              </button>
              <Link href="/profile">
                <div>
                  <FaUserCircle className="ml-5 size-10" />
                </div>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <button className="min-w-fit rounded bg-green-500 p-4 py-2 text-lg text-white transition-colors hover:bg-green-600">
                로그인
              </button>
            </Link>
          )}
        </div>
      </header>
      <AnimatePresence>
        {isUserMenuOpen && (
          <div className="lg:hidden">
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserMenuOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 z-50 h-full w-1/2 bg-light-light bg-opacity-100 dark:bg-dark-darker"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-5 dark:text-light-light">
                <Link href="/profile">
                  <div className="block py-2 text-lg">프로필</div>
                </Link>
                {isLoggedIn && (
                  <button
                    className="block w-full py-2 text-left text-lg text-red-600"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                )}
                <DarkModeToggle />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isMenuOpen && (
          <div className="lg:hidden">
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 z-50 h-full w-1/2 bg-light-light bg-opacity-100 dark:bg-dark-darker"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ul className="p-5 dark:text-light-light">
                <Link href={"/"}>
                  <li
                    className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-slate-700 ${
                      pathname === "/" ? "bg-slate-500" : ""
                    }`}
                  >
                    홈
                  </li>
                </Link>
                <Link href={"/books"}>
                  <li
                    className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-slate-700 ${
                      pathname === "/books" ? "bg-slate-500" : ""
                    }`}
                  >
                    모든 북스
                  </li>
                </Link>

                <Link href={"/community"}>
                  <li
                    className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-slate-700 ${
                      pathname === "/community" ? "bg-slate-500" : ""
                    }`}
                  >
                    커뮤니티
                  </li>
                </Link>
                <Link href={"/oneLine"}>
                  <li className="mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-slate-700">
                    한줄 책 추천
                  </li>
                </Link>
                <li
                  onClick={() => handleClick("/sns")}
                  className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-slate-700 ${
                    pathname === "/sns" ? "bg-slate-500" : ""
                  }`}
                >
                  SNS
                </li>
                {isLoggedIn ? (
                  <Link href={"/profile"}>
                    <li
                      className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-slate-700 ${
                        pathname === "/profile" ? "bg-slate-500" : ""
                      }`}
                    >
                      내 책장
                    </li>
                  </Link>
                ) : null}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
