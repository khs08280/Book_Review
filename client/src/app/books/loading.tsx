import Footer from "@/src/components/footer";
import { SideBar } from "@/src/components/sideBar";

export default function BooksLoading() {
  return (
    <>
      <SideBar />
      <div className="min-h-screen dark:bg-dark-darker dark:text-light-light sm:p-10 lg:ml-52">
        <div className="mr-5 sm:w-full">
          <div className="flex-col p-5">
            <div className="mb-5 flex justify-between">
              <span className="text-2xl">모든 북스</span>
              <select className="rounded-md bg-gray-200 p-2 px-3 dark:bg-dark-dark lg:block">
                <option>리뷰 많은 순</option>
                <option>추천 많은 순</option>
                <option>최근 리뷰 순</option>
              </select>
            </div>
            <div className="flex w-full items-center">
              <div className="w-full">
                <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 lg:gap-4">
                  {Array.from({ length: 12 }).map((_, index: number) => (
                    <div
                      key={index}
                      className="flex w-full  flex-col items-center rounded-lg border-2 border-solid border-green-400 border-opacity-40 bg-green-200 p-2 dark:border-opacity-10 dark:bg-dark-darker lg:p-5"
                    >
                      <div className="mb-3 h-48 w-32 lg:bg-green-400"></div>
                      <div className="my-1 w-full  rounded-lg bg-stone-300 p-2"></div>
                      <div className="w-full rounded-lg  bg-stone-300 p-2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
