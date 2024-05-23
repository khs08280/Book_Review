"use client";
import { SideBar } from "@/src/components/sideBar";
import { isExpired } from "@/src/hooks/isExpired";
import LocalStorage from "@/src/hooks/localStorage";
import { isLoggedInAtom } from "@/src/states/atoms";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function Profile() {
  const router = useRouter();
  const [deletePw, setDeletePw] = useState("");
  const [rePw, setRePw] = useState("");
  const [reCheckPw, setReCheckPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [introduction, setIntroduction] = useState("");

  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);

  let accessToken = LocalStorage.getItem("accessToken");

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkToken = async () => {
      if (!isLoggedIn) {
        console.log("로그인이 필요합니다");
        router.push("/");
      }
      const expired = await isExpired(accessToken);
      if (!accessToken || expired) {
        console.log("만료되었거나 유효하지 않은 토큰입니다.");
        router.push("/login");
      }
    };

    checkToken();
  }, [accessToken, router]);
  const fetchData = async () => {
    try {
      const expired = await isExpired(accessToken);

      if (!accessToken || expired) {
        return;
      }
      accessToken = LocalStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:5000/api/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const { data: myInfo, isLoading } = useQuery({
    queryKey: ["myInfo"],
    queryFn: fetchData,
    enabled: !!accessToken,
  });

  const handleDeleteAccount = async (e: any) => {
    e.preventDefault();
    const isReal = confirm("정말 회원탈퇴를 하시겠습니까?");
    if (isReal) {
      try {
        const expired = await isExpired(accessToken);

        if (!accessToken || expired) {
          return;
        }
        accessToken = LocalStorage.getItem("accessToken");
        const response = await fetch(
          `http://localhost:5000/api/users/delete-account`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ password: deletePw }),
            credentials: "include",
            method: "POST",
          },
        );
        const data = await response.json();
        if (response.status !== 200) {
          setError(data.message);
        } else {
          alert("정상적으로 회원탈퇴 하였습니다");
          LocalStorage.removeItem("accessToken");
          setIsLoggedIn(false);
          router.push("/");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    } else {
      return;
    }
  };
  const handleUpdatePw = async (e: any) => {
    e.preventDefault();
    const isReal = confirm("정말 비밀번호를 변경하시겠습니까?");
    if (isReal) {
      try {
        const expired = await isExpired(accessToken);
        if (!accessToken || expired) {
          return;
        }
        accessToken = LocalStorage.getItem("accessToken");

        const bodyData = {
          password: rePw,
          checkPassword: reCheckPw,
          newPassword: newPw,
        };

        const response = await fetch(
          `http://localhost:5000/api/users/updatePassword`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(bodyData),
            credentials: "include",
            method: "PATCH",
          },
        );

        const data = await response.json();

        if (response.status !== 200) {
          setError(data.message);
        } else {
          alert("정상적으로 비밀번호를 변경하였습니다.");
          location.reload();
        }
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    } else {
      return;
    }
  };
  const handleUpdateIntroduction = async () => {
    const isReal = confirm("정말 자기소개를 변경하시겠습니까?");
    if (isReal) {
      try {
        const expired = await isExpired(accessToken);
        if (!accessToken || expired) {
          return;
        }
        accessToken = LocalStorage.getItem("accessToken");

        const response = await fetch(
          `http://localhost:5000/api/users/updateIntroduction`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ content: introduction }),
            credentials: "include",
            method: "PATCH",
          },
        );

        const data = await response.json();

        if (response.status !== 200) {
          setError(data.message);
        } else {
          alert("정상적으로 자기소개를 변경하였습니다.");
          router.refresh();
        }
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    } else {
      return;
    }
  };
  const updateMutation = useMutation({
    mutationFn: handleUpdateIntroduction,
    onError: (error) => {
      console.error("자기소개 업데이트 중 에러:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      setIntroduction("");
    },
  });
  const updateReview = async () => {
    const expired = await isExpired(accessToken);

    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      router.push("/login");
      return;
    }
    accessToken = LocalStorage.getItem("accessToken");
    updateMutation.mutate();
  };

  return (
    <>
      <SideBar />
      <main className="ml-52  flex h-screen flex-col pl-20 pt-20">
        <section>
          <h3 className="text-2xl">내가 리뷰를 남긴 책</h3>
          <ul>
            {myInfo.review.map((review: IReview) => (
              <li key={review._id}></li>
            ))}
          </ul>
        </section>
        <div className="flex w-1/3 flex-col">
          <input
            className="bg-green-500 text-white"
            value={rePw}
            onChange={(e) => setRePw(e.target.value)}
          />
          <input
            className="bg-red-500 text-white"
            value={reCheckPw}
            onChange={(e) => setReCheckPw(e.target.value)}
          />
          <input
            className="bg-yellow-500 text-white"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
          />
          <button onClick={(e) => handleUpdatePw(e)}>비밀번호 변경</button>
        </div>
        <div className="flex w-1/3 flex-col">
          <input
            className="bg-black text-white"
            value={deletePw}
            onChange={(e) => setDeletePw(e.target.value)}
          />
          {error}
          <button onClick={(e) => handleDeleteAccount(e)}>회원 탈퇴</button>
        </div>
        <div className="flex w-1/3 flex-col">
          <input
            className="bg-blue-200"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
          />
          <button onClick={updateReview}>자기소개 변경</button>

          {myInfo?.introduction}
        </div>
      </main>
    </>
  );
}
