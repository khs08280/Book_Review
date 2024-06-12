import Link from "next/link";
import { useState } from "react";

export default function CommunityNav() {
  return (
    <nav>
      <ul className="mb-20 flex w-full justify-between  bg-green-300 p-5 dark:text-dark-dark sm:px-10 lg:px-20">
        <Link href={`/community/인기글`}>
          <li className="cursor-pointer">인기글</li>
        </Link>
        <Link href={`/community/자유`}>
          <li className="cursor-pointer">자유</li>
        </Link>

        <Link href={`/community/인문`}>
          <li className="cursor-pointer">인문</li>
        </Link>
        <Link href={`/community/자기계발`}>
          <li className="cursor-pointer">자기계발</li>
        </Link>
        <Link href={`/community/소설`}>
          <li className="cursor-pointer">소설</li>
        </Link>
        <Link href={`/community/웹툰`}>
          <li className="cursor-pointer">웹툰</li>
        </Link>
        <Link href={`/community/웹소설`}>
          <li className="cursor-pointer">웹소설</li>
        </Link>
      </ul>
    </nav>
  );
}
