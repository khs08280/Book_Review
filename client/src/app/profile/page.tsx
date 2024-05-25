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
  const [selectedIndex, setSelectedIndex] = useState(0);
  let accessToken = LocalStorage.getItem("accessToken");

  const handleMenuClick = (index: number) => {
    setSelectedIndex(index);
  };

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
      <main
        className="ml-52 flex items-center pl-80"
        style={{ height: "calc(100vh - 20vh)" }}
      >
        <nav className="mr-80">
          <ul>
            <li
              className=" mb-4 cursor-pointer text-xl text-blue-200"
              onClick={() => handleMenuClick(0)}
            >
              내가 추천한 책
            </li>
            <li
              className="  mb-4 cursor-pointer text-xl text-blue-200"
              onClick={() => handleMenuClick(1)}
            >
              내가 리뷰를 남긴 책
            </li>
            <li
              className="  mb-4 cursor-pointer text-xl text-blue-200"
              onClick={() => handleMenuClick(2)}
            >
              자기소개 변경
            </li>
            <li
              className="  mb-4 cursor-pointer text-xl text-blue-200"
              onClick={() => handleMenuClick(3)}
            >
              비밀번호 변경
            </li>
            <li
              className="  mb-4 cursor-pointer text-xl text-blue-200"
              onClick={() => handleMenuClick(4)}
            >
              회원탈퇴
            </li>
          </ul>
        </nav>
        <section className="flex flex-col">
          {selectedIndex === 1 && (
            <div>
              <h3 className="mb-5 text-2xl">내가 리뷰를 남긴 책</h3>
              <ul>
                {myInfo?.review?.length > 0 ? (
                  myInfo.review.map((review: IReview) => (
                    <li
                      className="mb-5 flex w-96 flex-col rounded-md border-2 border-solid border-dark-dark border-opacity-10 px-5 py-2"
                      key={review._id}
                    >
                      <span className="truncate text-2xl font-medium">
                        {review.book.title}
                      </span>
                      <span className="text-lg">{review.content}</span>
                    </li>
                  ))
                ) : (
                  <li>리뷰가 없습니다.</li>
                )}
              </ul>
            </div>
          )}
          {selectedIndex === 2 && (
            <div className="flex  flex-col">
              <h3 className="mb-5 text-2xl">자기소개 변경</h3>
              <span className="rounded-md border-2 border-solid border-blue-200 p-5 text-lg">
                {myInfo?.introduction}
              </span>
              <textarea
                className="my-5 h-16 w-96 resize-none rounded-md bg-green-400 px-3 py-2 text-light-light placeholder:text-light-light focus:outline-none"
                placeholder="변경할 자기소개를 입력해주세요"
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
              />
              <button
                className=" w-fit self-end rounded-lg bg-blue-200 px-3 py-2 text-dark-dark transition-all duration-75 hover:bg-slate-200"
                onClick={updateReview}
              >
                자기소개 변경
              </button>
            </div>
          )}
          {selectedIndex === 3 && (
            <div className="flex  flex-col">
              <h3 className="mb-5 text-2xl">비밀번호 변경</h3>
              <textarea
                className="my-5 h-16 w-96 resize-none rounded-md bg-green-400 px-3 py-2 text-light-light placeholder:text-light-light focus:outline-none"
                placeholder="기존 비밀번호"
                value={rePw}
                onChange={(e) => setRePw(e.target.value)}
              />
              <textarea
                className="my-5 h-16 w-96 resize-none rounded-md bg-green-400 px-3 py-2 text-light-light placeholder:text-light-light focus:outline-none"
                placeholder="기존 비밀번호 확인"
                value={reCheckPw}
                onChange={(e) => setReCheckPw(e.target.value)}
              />
              <textarea
                className="my-5 h-16 w-96 resize-none rounded-md bg-green-400 px-3 py-2 text-light-light placeholder:text-light-light focus:outline-none"
                placeholder="새 비밀번호"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
              <button className="w-fit self-center" onClick={handleUpdatePw}>
                비밀번호 변경
              </button>
            </div>
          )}
          {selectedIndex === 4 && (
            <div className="flex  flex-col">
              <h3 className="mb-5 text-2xl">회원탈퇴</h3>
              <textarea
                className="my-5 h-16 w-96 resize-none rounded-md bg-green-400 px-3 py-2 text-light-light placeholder:text-light-light focus:outline-none"
                placeholder="본인 확인을 위해 비밀번호를 입력해주세요"
                value={deletePw}
                onChange={(e) => setDeletePw(e.target.value)}
              />
              {error}
              <button
                className="w-fit self-center"
                onClick={handleDeleteAccount}
              >
                회원 탈퇴
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
