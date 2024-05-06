"use client";

import { Header } from "@/src/components/header";
import { Loginstate } from "@/src/states/atoms";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setIsLoggedIn = useSetRecoilState(Loginstate);
  const router = useRouter();
  const data = {
    username,
    password,
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      });
      console.log(await response.json());
      if (response.status == 200) {
        setIsLoggedIn(true);
        router.push("/");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      throw error;
    }
  };

  return (
    <>
      <Header />
      <div className="h-screen p-40 bg-light-lightest flex flex-col items-center justify-start">
        <div className="border-2 border-solid border-green-400 rounded-lg py-10 px-32 mb-5 flex flex-col items-center h-fit bg-white">
          <span className="text-3xl mb-20">로그인</span>
          <div className="flex flex-col w-96 mb-20 border-collapse">
            <input
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-4 h-10 cursor-pointer focus:outline-none rounded-lg rounded-b-none border-2 border-b-0 border-solid border-black border-opacity-20"
            />
            <input
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-4 h-10 cursor-pointer rounded-lg focus:outline-none rounded-t-none border-2 border-solid border-black border-opacity-20"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full h-12 rounded-lg bg-green-400"
          >
            로그인
          </button>
        </div>
        <Link href={"/join"}>
          <span>회원가입</span>
        </Link>
      </div>
    </>
  );
}
