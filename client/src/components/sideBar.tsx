"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";

export function SideBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="p-5 w-52 h-screen border-r border-solid border-black fixed">
      <ul>
        <Link href={"/"}>
          <li className="text-xl mb-1 hover:bg-stone-400 cursor-pointer p-2 rounded transition-colors">
            홈
          </li>
        </Link>
        <li className="text-xl mb-1 hover:bg-stone-400 cursor-pointer p-2 rounded transition-colors">
          SNS
        </li>
        <li className="text-xl mb-1 hover:bg-stone-400 cursor-pointer p-2 rounded transition-colors">
          커뮤니티
        </li>
        <li className="text-xl mb-1 hover:bg-stone-400 cursor-pointer p-2 rounded transition-colors">
          한줄 책 추천
        </li>
      </ul>
    </div>
  );
}
