import Link from "next/link";
import { IoSearch } from "react-icons/io5";

export function Header() {
  return (
    <header className="bg-light-lighter dark:bg-dark-darker flex max-w-full justify-between px-8 py-5 items-center shadow sticky top-0 ">
      <Link href={"/"}>
        <h1 className=" text-3xl ">BOOX</h1>
      </Link>
      <div className="flex max-w-fit items-center ">
        <IoSearch className=" size-6" />
        <Link href={"/login"}>
          <div className="py-2 p-4 transition-colors rounded hover:bg-green-400 text-lg ml-10">
            로그인
          </div>
        </Link>
      </div>
    </header>
  );
}
