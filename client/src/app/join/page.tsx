"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <div className="flex h-screen flex-col items-center justify-start bg-light-lightest p-40">
        <div className="mb-5 flex h-fit flex-col items-center rounded-lg border-2 border-solid border-green-400 bg-white px-32 py-10">
          <span className="mb-20 text-3xl">회원가입</span>
          <div className="mb-20 flex w-96 border-collapse flex-col">
            <input
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-3 h-10 cursor-pointer rounded-lg border-2 border-solid border-black border-opacity-20 p-4 focus:outline-none"
            />
            <input
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3 h-10 cursor-pointer rounded-lg border-2  border-solid border-black border-opacity-20 p-4 focus:outline-none"
            />
            <input
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3 h-10 cursor-pointer rounded-lg border-2 border-solid border-black border-opacity-20 p-4 focus:outline-none"
            />
            <input
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mb-3 h-10 cursor-pointer rounded-lg border-2 border-solid  border-black border-opacity-20 p-4 focus:outline-none"
            />
          </div>
          <span className="text-lg text-red-600">{error}</span>
          <button
            onClick={handleLogin}
            className="h-12 w-full rounded-lg bg-green-400"
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
