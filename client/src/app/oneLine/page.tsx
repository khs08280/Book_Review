"use client";

import { SideBar } from "@/src/components/sideBar";
import { isExpired } from "@/src/hooks/isExpired";
import LocalStorage from "@/src/hooks/localStorage";
import { maskUsername } from "@/src/hooks/maskUsername";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import jwt, { JwtPayload } from "jsonwebtoken";
import useClickOutside from "@/src/hooks/outsideClick";
import { formatDate } from "@/src/hooks/checkDate";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";

export default function OneLine() {
  const [content, setContent] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOneLineId, setSelectedOneLineId] = useState("");
  const [isSelectedOneLineOpen, setIsSelectedOneLineOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [searchedBooks, setSearchedBook] = useState([]);
  const divRef = useRef<HTMLDivElement>(null);
  let accessToken = LocalStorage.getItem("accessToken");
  let userId: string;

  useEffect(() => {
    const loggedUserData = LocalStorage.getItem("loggedUserData");
    if (loggedUserData) {
      const { userAtom } = JSON.parse(loggedUserData);
      userId = userAtom._id;
    }
  }, []);

  const queryClient = useQueryClient();

  const fetchOneLines = async () => {
    const response = await fetch(`http://localhost:5000/api/oneLines`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    console.log(data.data);
    return data.data;
  };
  const { data: oneLines, isLoading } = useQuery({
    queryKey: ["oneLines"],
    queryFn: fetchOneLines,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      console.log(content);
      const response = await fetch("http://localhost:5000/api/oneLines", {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
        credentials: "include",
      });
      const fetchData = await response.json();
      if (!response.ok) {
        console.log(fetchData);
        throw new Error("Network response was not ok");
      }
      console.log(fetchData);
    },
    onError: (error) => {
      console.error("Review creation error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["oneLines"],
      });
      setContent("");
    },
  });

  const createComment = async () => {
    if (!content || content.trim() === "") {
      alert("내용을 입력해주세요");
      return;
    }

    const expired = await isExpired(accessToken);

    if (expired) {
      accessToken = LocalStorage.getItem("accessToken");
    }

    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      return;
    }

    createMutation.mutate();
  };
  type MutationVariables = {
    oneLineId: string;
    content: string;
  };

  const updateMutation = useMutation({
    mutationFn: async ({ oneLineId, content }: MutationVariables) => {
      const response = await fetch("http://localhost:5000/api/oneLines", {
        method: "PATCH",
        body: JSON.stringify({ oneLineId, content }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
        credentials: "include",
      });
      const fetchData = await response.json();
      if (!response.ok) {
        console.log(fetchData);
        throw new Error("Network response was not ok");
      }
      console.log(fetchData);
    },
    onError: (error) => {
      console.error("Review creation error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["oneLines"],
      });
      setContent("");
    },
  });

  const updateComment = async (oneLineId: string, oneLineContent: string) => {
    const expired = await isExpired(accessToken);

    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      return;
    }

    accessToken = LocalStorage.getItem("accessToken");

    updateMutation.mutate({ oneLineId, content: oneLineContent });
  };

  const deleteMutation = useMutation({
    mutationFn: async (oneLineId: string) => {
      const response = await fetch("http://localhost:5000/api/oneLines", {
        method: "DELETE",
        body: JSON.stringify({ oneLineId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
        credentials: "include",
      });
      const fetchData = await response.json();
      if (!response.ok) {
        console.log(fetchData);
        throw new Error("Network response was not ok");
      }
      console.log(fetchData);
    },
    onError: (error) => {
      console.error("Review creation error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["oneLines"],
      });
      setContent("");
    },
  });

  const deleteComment = async (oneLineId: string) => {
    const check = confirm("정말 삭제하시겠습니까?");
    if (check) {
      const expired = await isExpired(accessToken);

      if (expired) {
        accessToken = LocalStorage.getItem("accessToken");
      }

      if (!accessToken || expired) {
        console.log("만료되었거나 유효하지 않은 토큰입니다.");
        return;
      }

      deleteMutation.mutate(oneLineId);
    }
  };

  const menuCliked = (oneLineId: string, oneLineContent: string) => {
    setIsMenuOpen((prev) => !prev);
    setSelectedOneLineId(oneLineId);
    setUpdateContent(oneLineContent);
  };
  useClickOutside(divRef, () => {
    setIsMenuOpen(false);
  });
  const handleSearch = async (searchText: string) => {
    const response = await fetch(
      `http://localhost:5000/api/oneLines/${searchText}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      },
    );
    const data = await response.json();

    if (!response.ok) {
      console.log(data);
      return;
    }
    console.log(data.data);
  };
  const delayedSearch = debounce(handleSearch, 300);
  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
    delayedSearch(e.target.value);
  };

  return (
    <div>
      <SideBar />
      <div className="ml-52 flex h-screen justify-center bg-blue-300 pt-20">
        <main className="flex w-1/2 flex-col bg-slate-400 p-10">
          <section className="mb-6">
            <h3 className="text-2xl">한줄 책 추천</h3>
            <form className="ml-2">
              <input
                onChange={handleSearchChange}
                value={searchText}
                className="h-7 w-full rounded-md border border-solid border-black pl-2 focus:outline-green-400"
              />
            </form>
            <div>
              <textarea
                onChange={(e) => setContent(e.target.value)}
                value={content}
                className="my-5 h-20 w-full resize-none rounded-md p-2 focus:outline-none"
              />
              <div onClick={createComment}>등록</div>
            </div>
          </section>
          <section>
            <ul>
              {oneLines &&
                oneLines.map((oneLine: IOneLine, index: number) => (
                  <li className="mb-3 py-2" key={index}>
                    <div className="flex flex-col ">
                      <div className="flex items-center justify-between">
                        <div className="mb-2 text-sm opacity-35">
                          <span className="mr-2">
                            {oneLine.author.nickname} (
                            {maskUsername(oneLine.author.username)})
                          </span>
                          <span>
                            {oneLine.modifiedAt
                              ? formatDate(oneLine.modifiedAt)
                              : formatDate(oneLine.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {userId == oneLine.author._id && (
                            <div key={oneLine._id} className="relative">
                              <CiMenuKebab
                                onClick={() =>
                                  menuCliked(oneLine._id, oneLine.content)
                                }
                                className="size-4 cursor-pointer"
                              />
                              {isMenuOpen &&
                                selectedOneLineId === oneLine._id && (
                                  <div
                                    ref={divRef}
                                    className="absolute left-0 top-6 z-10 flex w-16 flex-col items-center justify-center rounded-sm bg-light-light p-2 shadow-lg"
                                  >
                                    {isSelectedOneLineOpen ? (
                                      <span
                                        onClick={() =>
                                          setIsSelectedOneLineOpen(false)
                                        }
                                        className="mb-2 cursor-pointer text-center text-red-500"
                                      >
                                        취소
                                      </span>
                                    ) : (
                                      <span
                                        onClick={() => {
                                          setIsSelectedOneLineOpen(true);
                                        }}
                                        className="mb-2 cursor-pointer text-center text-blue-500"
                                      >
                                        수정
                                      </span>
                                    )}
                                    <span
                                      onClick={() => deleteComment(oneLine._id)}
                                      className="cursor-pointer text-center text-red-500"
                                    >
                                      삭제
                                    </span>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                      <span>{oneLine.content}</span>
                    </div>
                    {isSelectedOneLineOpen && (
                      <div className="ml-12 mt-4 flex flex-col items-end rounded-md bg-light-light p-4 shadow-md">
                        <textarea
                          onChange={(e) => setUpdateContent(e.target.value)}
                          value={updateContent}
                          className="h-24 w-full resize-none rounded-md border border-gray-300 bg-light-light p-2 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            updateComment(oneLine._id, updateContent);
                            setIsSelectedOneLineOpen(false);
                          }}
                          className=" mt-2 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
