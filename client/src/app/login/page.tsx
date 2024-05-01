import { Header } from "@/src/components/header";
import { SideBar } from "@/src/components/sideBar";

export default function Login() {
  return (
    <>
      <Header />
      <SideBar />
      <div className="w-3/5 h-screen p-5 mx-auto my-0 mt-5 bg-light-light">
        <span>@3123</span>
      </div>
    </>
  );
}
