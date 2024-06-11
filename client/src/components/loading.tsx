import { SideBar } from "./sideBar";
import Footer from "./footer";

export default function Loading() {
  return (
    <>
      <SideBar />
      <div className=" ml-52 flex h-full bg-slate-400 p-10 dark:bg-dark-darker dark:text-light-light">
        <div className="mr-5  grid w-4/6 grid-cols-2 grid-rows-4 gap-5">
          <div className="col-span-2 w-full">
            <h2 className="mb-5 text-2xl">Hot 리뷰 북스</h2>
            <ul className="mb-5 flex ">
              {Array.from({ length: 4 }).map((_, index: number) => (
                <li className="mr-5 flex h-96 w-96 items-center rounded-lg border-2 border-solid border-gray-300 bg-gray-300 p-5 first-line:flex-col dark:border-opacity-20 dark:bg-dark-darker">
                  <div className=" h-20 w-full place-self-end rounded-lg bg-light-lighter p-2 dark:bg-dark-dark">
                    <div className="mb-2 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                    <div className="mb-2 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                    <div className="h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mb-5 flex flex-col">
              <h2 className="mb-5 text-2xl">New 리뷰 북스</h2>
              <ul className="mb-5 flex ">
                {Array.from({ length: 4 }).map((_, index: number) => (
                  <li className="mr-5 flex h-96 w-96 items-center rounded-lg border-2 border-solid border-gray-300 bg-gray-300 p-5 first-line:flex-col dark:border-opacity-20 dark:bg-dark-darker">
                    <div className=" h-20 w-full place-self-end rounded-lg bg-light-lighter p-2 dark:bg-dark-dark">
                      <div className="mb-2 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                      <div className="mb-2 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                      <div className="h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-5 flex flex-col">
              <h2 className="mb-5 text-2xl">New 리뷰 북스</h2>
              <ul className="mb-5 flex ">
                {Array.from({ length: 4 }).map((_, index: number) => (
                  <li className="mr-5 flex h-96 w-96 items-center rounded-lg border-2 border-solid border-gray-300 bg-gray-300 p-5 first-line:flex-col dark:border-opacity-20 dark:bg-dark-darker">
                    <div className=" h-20 w-full place-self-end rounded-lg bg-light-lighter p-2 dark:bg-dark-dark">
                      <div className="mb-2 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                      <div className="mb-2 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                      <div className="h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-5 flex flex-col">
              <h2 className="mb-5 text-2xl">New 리뷰 북스</h2>
              <ul className="mb-5 flex ">
                {Array.from({ length: 4 }).map((_, index: number) => (
                  <li className="mr-5 flex h-96 w-96 items-center rounded-lg border-2 border-solid border-gray-300 bg-gray-300 p-5 first-line:flex-col dark:border-opacity-20 dark:bg-dark-darker">
                    <div className=" h-20 w-full place-self-end rounded-lg bg-light-lighter p-2 dark:bg-dark-dark">
                      <div className="mb-2 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                      <div className="mb-2 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                      <div className="h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-1/3 flex-col">
          <div className="mb-3 ml-8 h-1/2 ">
            <div className="">
              <h2 className="mb-5 text-2xl">지금 커뮤니티는?</h2>
              <ul>
                {Array.from({ length: 10 }).map((_, index) => (
                  <li
                    key={index}
                    className="flex w-full justify-between rounded-lg border-2 border-solid border-black border-opacity-40 bg-light-light px-4 py-3 dark:bg-dark-dark"
                  >
                    <div className="flex w-full flex-col">
                      <div className="mb-2 h-3 w-full rounded-xl bg-gray-300 dark:bg-opacity-20" />
                      <div className="mb-2 h-3 w-full rounded-xl bg-gray-200 dark:bg-opacity-20" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mb-3 ml-8 h-1/2 ">
            <div className="">
              <h2 className="mb-5 text-2xl">한줄 책 추천</h2>
              <ul>
                {Array.from({ length: 10 }).map((_, index) => (
                  <li
                    key={index}
                    className="flex w-full justify-between rounded-lg border-2 border-solid border-black border-opacity-40 bg-light-light px-4 py-3"
                  >
                    <div className="flex w-full flex-col">
                      <div className="mb-2 h-3 w-full rounded-xl bg-gray-300" />
                      <div className="mb-2 h-3 w-full rounded-xl bg-gray-200" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
