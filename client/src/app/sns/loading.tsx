import Footer from "@/src/components/footer";
import { SideBar } from "@/src/components/sideBar";
import { FaUserCircle } from "react-icons/fa";

export default function SnsAllLoading() {
  return (
    <div>
      <SideBar />
      <main className="flex flex-col items-center dark:bg-dark-darker dark:text-light-light lg:ml-52 lg:p-5">
        <div className=" min-h-screen  w-full bg-green-200 p-5 dark:bg-dark-dark sm:w-2/3 lg:min-w-main_box lg:max-w-fit">
          <h2 className="mb-4 text-2xl font-medium">북스타그램</h2>
          <section>
            {Array.from({ length: 4 }).map((_, index: number) => (
              <div className="mb-5 flex w-full flex-col justify-between rounded-md border-2 border-solid border-white p-5 dark:border-opacity-20 dark:bg-dark-dark dark:text-light-light">
                <div className="mb-5 flex items-center dark:bg-dark-dark">
                  <FaUserCircle className="mr-3 size-10 " />
                  <div className="flex-col">
                    <div className="mb-2 h-3 w-20 rounded-xl bg-gray-300 bg-opacity-20" />
                    <div className="mb-2 h-3 w-40 rounded-xl bg-gray-200 bg-opacity-20" />
                  </div>
                </div>
                <div className="flex-col">
                  <div className="mb-4 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                  <div className="mb-4 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                  <div className="mb-4 h-3 w-full rounded-xl bg-gray-300 bg-opacity-20" />
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
