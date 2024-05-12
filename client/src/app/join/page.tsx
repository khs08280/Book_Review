"use client";

import LocalStorage from "@/src/hooks/localStorage";
import { isLoggedInAtom } from "@/src/states/atoms";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function Join() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const data = {
    username,
    password,
    email,
    nickname,
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/join", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        credentials: "include",
      });
      if (response.status === 201) {
        router.push("/login");
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.error);
        console.error("회원가입 오류:", response.statusText);
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="h-screen p-40 bg-light-lightest flex flex-col items-center justify-start">
        <div className="border-2 border-solid border-green-400 rounded-lg py-10 px-32 mb-5 flex flex-col items-center h-fit bg-white">
          <span className="text-3xl mb-20">회원가입</span>
          <div className="flex flex-col w-96 mb-20 border-collapse">
            <input
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-4 h-10 mb-3 cursor-pointer focus:outline-none rounded-lg border-2 border-solid border-black border-opacity-20"
            />
            <input
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-4 h-10 mb-3 cursor-pointer rounded-lg  focus:outline-none border-2 border-solid border-black border-opacity-20"
            />
            <input
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-4 h-10 mb-3 cursor-pointer rounded-lg focus:outline-none border-2 border-solid border-black border-opacity-20"
            />
            <input
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="p-4 h-10 mb-3 cursor-pointer rounded-lg focus:outline-none  border-2 border-solid border-black border-opacity-20"
            />
          </div>
          <span className="text-lg text-red-600">{error}</span>
          <button
            onClick={handleLogin}
            className="w-full h-12 rounded-lg bg-green-400"
          >
            회원가입
          </button>
        </div>
        <Link href={"/login"}>
          <span className=" hover:underline">로그인</span>
        </Link>
      </div>
    </>
  );
}
