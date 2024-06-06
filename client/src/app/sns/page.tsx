import { SideBar } from "@/src/components/sideBar";
import SnsActivityLogs from "@/src/components/snsActivityLogs";

export default function Sns() {
  return (
    <div>
      <SideBar />
      <main className="ml-52 flex flex-col items-center p-5">
        <div className=" h-screen min-w-main_box max-w-fit bg-blue-200 p-5">
          <h2 className="mb-4 text-2xl font-medium">북스타그램</h2>
          <SnsActivityLogs />
        </div>
      </main>
    </div>
  );
}
