import CommunityNav from "@/src/components/communityNav";
import Footer from "@/src/components/footer";
import { SideBar } from "@/src/components/sideBar";

export default function CommunityLoading() {
  return (
    <div>
      <SideBar />
      <div className="ml-52 flex justify-center p-10">
        <main className="h-screen w-7/12 bg-green-200">
          <CommunityNav />
          <section className="flex flex-col">
            {Array.from({ length: 10 }).map((_, index) => (
              <li
                key={index}
                className=" flex h-16 flex-col justify-center rounded-lg border-2 border-solid border-green-200  bg-light-light p-3"
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
