"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { isLoggedInAtom } from "../states/atoms";
import { useEffect, useState } from "react";
import LocalStorage from "../hooks/localStorage";
import { isExpired } from "../hooks/isExpired";

export function SideBar() {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const pathname = usePathname();
  const [login, setLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) setLogin(true);
  }, [isLoggedIn]);
  const handleClick = async (href: string) => {
    const accessToken = LocalStorage.getItem("accessToken");
    const expired = await isExpired(accessToken);

    if (expired || !accessToken) {
      console.log("토큰이 이상합니다");
      router.push("/login");
      return;
    }

    router.push(href);
  };

  return (
    <div className="fixed h-screen w-52 border-r border-solid border-black border-opacity-10 p-5 shadow">
      <ul>
        <Link href={"/"}>
          <li
            className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400 ${
              pathname === "/" ? "bg-stone-200" : ""
            }`}
          >
            홈
          </li>
        </Link>
        <Link onClick={() => handleClick("/sns")} href={"/sns"}>
          <li
            className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400 ${
              pathname === "/sns" ? "bg-stone-200" : ""
            }`}
          >
            SNS
          </li>
        </Link>
        <Link href={"/community"}>
          <li
            className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400 ${
              pathname === "/community" ? "bg-stone-200" : ""
            }`}
          >
            커뮤니티
          </li>
        </Link>
        <Link href={"/oneLine"}>
          <li className="mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400">
            한줄 책 추천
          </li>
        </Link>
        {login ? (
          <Link href={"/profile"}>
            <li
              className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400 ${
                pathname === "/profile" ? "bg-stone-200" : ""
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
