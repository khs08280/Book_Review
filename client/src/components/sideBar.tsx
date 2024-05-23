"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideBar() {
  const pathname = usePathname();
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
        <Link href={"/sns"}>
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
        <li className="mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400">
          한줄 책 추천
        </li>
        <Link href={"/profile"}>
          <li
            className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400 ${
              pathname === "/profile" ? "bg-stone-200" : ""
            }`}
          >
            내 책장
          </li>
        </Link>
      </ul>
    </div>
  );
}
