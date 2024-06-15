import Link from "next/link";
import { useState } from "react";

export default function CommunityNav() {
  return (
    <nav>
      <ul className="mb-20 flex w-full justify-between  bg-green-300 p-5 dark:bg-stone-700 dark:text-light-light sm:px-10 lg:px-20">
        <Link href={`/community/category?category=인기글&page=1`}>
          <li className="cursor-pointer">인기글</li>
        </Link>
        <Link href={`/community?category=all&page=1`}>
          <li className="cursor-pointer">전체 게시글</li>
        </Link>
        <Link href={`/community/category?category=자유&page=1`}>
          <li className="cursor-pointer">자유</li>
        </Link>

        <Link href={`/community/category?category=인문&page=1`}>
          <li className="cursor-pointer">인문</li>
        </Link>
        <Link href={`/community/category?category=자기계발&page=1`}>
          <li className="cursor-pointer">자기계발</li>
        </Link>
        <Link href={`/community/category?category=소설&page=1`}>
          <li className="cursor-pointer">소설</li>
        </Link>
        <Link href={`/community/category?category=웹툰&page=1`}>
          <li className="cursor-pointer">웹툰</li>
        </Link>
        <Link href={`/community/category?category=웹소설&page=1`}>
          <li className="cursor-pointer">웹소설</li>
        </Link>
      </ul>
    </nav>
  );
}
