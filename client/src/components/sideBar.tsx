"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import { useEffect, useState } from "react";
import LocalStorage from "../hooks/localStorage";
import { isExpired } from "../hooks/isExpired";

export function SideBar() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const pathname = usePathname();
  const [login, setLogin] = useState(false);
  const router = useRouter();
  let accessToken = LocalStorage.getItem("accessToken");

  useEffect(() => {
    if (isLoggedIn) setLogin(true);
  }, [isLoggedIn]);

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

    if (login) {
      router.push(href);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="fixed  hidden   h-screen border-r border-solid border-black border-opacity-10 p-5 shadow dark:border-r-2 dark:border-solid dark:border-light-light dark:border-opacity-5 dark:bg-dark-darker dark:text-light-light lg:block  lg:w-52">
      <ul>
        <Link href={"/"}>
          <li
            className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-green-400 dark:hover:bg-stone-500 ${
              pathname === "/" ? "bg-green-200 dark:bg-stone-700" : ""
            }`}
          >
            홈
          </li>
        </Link>
        <Link href={"/books"}>
          <li
            className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-green-400 dark:hover:bg-stone-500 ${
              pathname === "/books" ? "bg-green-200 dark:bg-stone-700" : ""
            }`}
          >
            모든 북스
          </li>
        </Link>

        <Link href={"/community"}>
          <li
            className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-green-400 dark:hover:bg-stone-500 ${
              pathname === "/community" ? "bg-green-200 dark:bg-stone-700" : ""
            }`}
          >
            커뮤니티
          </li>
        </Link>
        <Link href={"/oneLine"}>
          <li className="mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-green-400 dark:hover:bg-stone-500">
            한줄 책 추천
          </li>
        </Link>
        <li
          onClick={() => handleClick("/sns")}
          className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-green-400 dark:hover:bg-stone-500 ${
            pathname === "/sns" ? "bg-green-200 dark:bg-stone-700" : ""
          }`}
        >
          SNS
        </li>
        {login ? (
          <Link href={"/profile"}>
            <li
              className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-green-400 dark:hover:bg-stone-500 ${
                pathname === "/profile" ? "bg-green-200 dark:bg-stone-700" : ""
              }`}
            >
              내 책장
            </li>
          </Link>
        ) : null}
      </ul>
    </div>
  );
}
