"use client";

import Footer from "@/src/components/footer";
import LocalStorage from "@/src/hooks/localStorage";
import { isLoggedInAtom, userAtom } from "@/src/states/atoms";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const setAuth = useSetRecoilState(userAtom);
  const [error, setError] = useState("");

  const router = useRouter();
  const data = {
    username,
    password,
  };

  useEffect(() => {
    if (isLoggedIn) {
      alert(
        "이미 로그인 된 사용자 입니다. 해당 페이지를 이용하시려면 로그아웃을 해주세요.",
      );
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        credentials: "include",
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.error);
        console.error("로그인 오류:", response.statusText);
        setTimeout(() => {
          setError("");
        }, 3000);
        return;
      }
      const responseData = await response.json();
      setAuth(responseData.user);
      LocalStorage.setItem("accessToken", responseData.accessToken);
      setIsLoggedIn(true);
      router.push("/");
    } catch (error) {
      console.error("로그인 오류:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-start bg-light-lightest px-60 py-40 dark:bg-dark-darker dark:text-light-light sm:p-40">
        <form
          className="mb-5 flex h-fit flex-col items-center rounded-lg border-2 border-solid border-green-400 bg-white px-10 py-10 dark:border-opacity-20 dark:bg-dark-darker sm:px-32"
          onSubmit={handleLogin}
        >
          <span className="mb-10 text-3xl sm:mb-20">로그인</span>
          <div className="mb-10 flex border-collapse flex-col sm:mb-20 sm:w-96">
            <input
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 cursor-pointer rounded-lg rounded-b-none border-2 border-b-0 border-solid border-black border-opacity-20 p-4 focus:outline-none dark:bg-dark-dark"
            />
            <input
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 cursor-pointer rounded-lg rounded-t-none border-2 border-solid border-black border-opacity-20 p-4 focus:outline-none dark:bg-dark-dark"
              type="password"
            />
          </div>
          <span>{error}</span>
          <button type="submit" className="h-12 w-full rounded-lg bg-green-400">
            로그인
          </button>
        </form>
        <Link className="w-20" href={"/join"}>
          <span className="hover:underline">회원가입</span>
        </Link>
      </div>
    </>
  );
}
