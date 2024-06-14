import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" sm:p-15 border-t border-solid  border-black border-opacity-10 bg-white p-10 py-20 text-dark-dark text-opacity-50 dark:border-light-light  dark:border-opacity-10 dark:bg-dark-darker dark:text-light-light lg:ml-52 lg:p-20">
      <div className="flex flex-col items-center justify-center ">
        <ul className="flex">
          <Link href={"/"}>
            <li
              className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400`}
            >
              홈
            </li>
          </Link>
          <Link href={"/sns"}>
            <li
              className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400`}
            >
              SNS
            </li>
          </Link>
          <Link href={"/community"}>
            <li
              className={`mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400`}
            >
              커뮤니티
            </li>
          </Link>
          <Link href={"/oneLine"}>
            <li className="mb-1 cursor-pointer rounded p-2 text-xl transition-colors hover:bg-stone-400">
              한줄 책 추천
            </li>
          </Link>
        </ul>
        <div className="">&copy; BOOX </div>
      </div>
    </footer>
  );
}
