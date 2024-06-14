import { SideBar } from "@/src/components/sideBar";
import SnsActivityLogs from "@/src/components/snsActivityLogs";
import { Suspense } from "react";
import SnsLoading from "./loading";

export default function Sns() {
  return (
    <div>
      <SideBar />
      <main className="flex flex-col items-center dark:bg-dark-darker dark:text-light-light lg:ml-52 lg:p-5">
        <div className=" min-h-screen  w-full bg-green-200 p-5 dark:bg-dark-dark sm:w-2/3 lg:min-w-main_box lg:max-w-fit">
          <h2 className="mb-4 text-2xl font-medium">북스타그램</h2>
          <SnsActivityLogs />
        </div>
      </main>
    </div>
  );
}
