import { Suspense } from "react";
import { SideBar } from "../components/sideBar";
import { BookList } from "../components/book-list";
import Footer from "../components/footer";

export default function Loading() {
  return (
    <>
      <SideBar />
      <div className=" ml-52 flex h-full bg-slate-400 p-5">
        <div className="mr-5  grid w-4/6 grid-cols-2 grid-rows-4 gap-5">
          <div className="col-span-2">
            <div className="mb-2 text-2xl">Hot 리뷰 북스</div>
            <span>Loading</span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mb-3 h-1/2">
            <div className="mb-2 text-2xl">지금 커뮤니티는?</div>
          </div>
          <div className="">
            <div className="mb-2 text-2xl">한 줄 책 추천</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
