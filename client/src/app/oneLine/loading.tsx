import CommunityNav from "@/src/components/communityNav";
import Footer from "@/src/components/footer";
import { SideBar } from "@/src/components/sideBar";

export default function CommunityLoading() {
  return (
    <div>
      <SideBar />
      <div className="ml-52 flex justify-center  pt-20">
        <main className="flex w-1/2 flex-col bg-green-200 p-10">
          <h3 className="text-2xl">한줄 책 추천</h3>
          <form className="my-3 w-full">
            <input
              className="h-10 w-full rounded-md border border-gray-300 pl-3 focus:border-green-400 focus:outline-none"
              placeholder="추천 할 책을 검색해주세요"
            />
          </form>

          <div className="my-5 flex items-center bg-white pr-3">
            <textarea
              placeholder="책을 마음껏 추천해주세요"
              className=" h-32 w-full resize-none rounded-md p-3 focus:outline-none"
            />
          </div>
          <span className="mb-5">등록</span>
          <section className="flex flex-col">
            {Array.from({ length: 10 }).map((_, index) => (
              <li
                key={index}
                className=" flex h-16 flex-col justify-center rounded-lg border-2 border-solid border-green-200 bg-light-light p-3"
              >
                <div className="mb-2 h-3 w-20 rounded-xl bg-gray-300" />

                <div className="mb-2 h-3 w-40 rounded-xl bg-gray-200" />
              </li>
            ))}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
