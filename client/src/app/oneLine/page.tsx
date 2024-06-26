"use client";

import { SideBar } from "@/src/components/sideBar";
import { isExpired } from "@/src/hooks/isExpired";
import LocalStorage from "@/src/hooks/localStorage";
import { maskUsername } from "@/src/hooks/maskUsername";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import useClickOutside from "@/src/hooks/outsideClick";
import { formatDate } from "@/src/hooks/checkDate";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "@/src/states/atoms";
import { FaXmark } from "react-icons/fa6";
import OneLineLoading from "./loading";

const initialBookData: ISearchedBook = {
  _id: "",
  title: "",
  titleNoSpaces: "",
  writer: "",
  image: "",
};

export default function OneLine() {
  const [content, setContent] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOneLineId, setSelectedOneLineId] = useState("");
  const [isSelectedOneLineOpen, setIsSelectedOneLineOpen] = useState(false);

  const [searchedBooks, setSearchedBook] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedBookData, setSearchedBookData] =
    useState<ISearchedBook>(initialBookData);

  const [updateSearchedBooks, setUpdateSearchedBook] = useState([]);
  const [updateSearchText, setUpdateSearchText] = useState("");
  const [updateSearchedBookData, setUpdateSearchedBookData] =
    useState<ISearchedBook>(initialBookData);

  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);

  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  let accessToken = LocalStorage.getItem("accessToken");
  let userId: string;

  const loggedUserData = LocalStorage.getItem("loggedUserData");
  if (loggedUserData) {
    const { userAtom } = JSON.parse(loggedUserData);
    userId = userAtom._id;
  }

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
      const response = await fetch("http://localhost:5000/api/oneLines", {
        method: "POST",
        body: JSON.stringify({ content, bookId: searchedBookData._id }),
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
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken) {
      console.log("액세스 토큰이 올바르지 않습니다");
      return;
    }
    if (expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      setIsLoggedIn(false);
      LocalStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }

    createMutation.mutate();
  };
  type MutationVariables = {
    oneLineId: string;
    content: string;
    bookId: string | null;
  };

  const updateMutation = useMutation({
    mutationFn: async ({ oneLineId, content, bookId }: MutationVariables) => {
      const response = await fetch("http://localhost:5000/api/oneLines", {
        method: "PATCH",
        body: JSON.stringify({
          oneLineId,
          content,
          bookId,
        }),
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
      setUpdateSearchedBookData(initialBookData);
    },
  });

  const updateComment = async (oneLineId: string, oneLineContent: string) => {
    const expired = await isExpired(accessToken);
    accessToken = LocalStorage.getItem("accessToken");
    if (!accessToken || expired) {
      console.log("만료되었거나 유효하지 않은 토큰입니다.");
      setIsLoggedIn(false);
      LocalStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }

    updateMutation.mutate({
      oneLineId,
      content: oneLineContent,
      bookId: updateSearchedBookData._id || null,
    });
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
      accessToken = LocalStorage.getItem("accessToken");
      if (!accessToken || expired) {
        console.log("만료되었거나 유효하지 않은 토큰입니다.");
        setIsLoggedIn(false);
        LocalStorage.removeItem("accessToken");
        router.push("/login");
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
    setSearchedBook(data.data);
  };
  const handleUpdateSearch = async (searchText: string) => {
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
    setUpdateSearchedBook(data.data);
  };

  const delayedSearch = debounce(handleSearch, 300);
  const delayedUpdateSearch = debounce(handleUpdateSearch, 300);

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
    delayedSearch(e.target.value);
  };
  const handleUpdateSearchChange = (e: any) => {
    setUpdateSearchText(e.target.value);
    delayedUpdateSearch(e.target.value);
  };

  const searchedBookClick = (searchedBook: ISearchedBook) => {
    setSearchedBookData(searchedBook);
    setSearchText("");
    setSearchedBook([]);
  };
  const updateSearchedBookClick = (searchedBook: ISearchedBook) => {
    setUpdateSearchedBookData(searchedBook);
    setUpdateSearchText("");
    setUpdateSearchedBook([]);
  };
  if (isLoading) {
    return <OneLineLoading />;
  }

  return (
    <div>
      <SideBar />
      <div className="flex justify-center  dark:bg-dark-darker dark:text-light-light lg:ml-52 lg:pt-20">
        <main className="flex w-full flex-col border-green-400 bg-green-200 p-10 dark:bg-dark-dark lg:w-1/2">
          <section className="mb-6">
            <h3 className="text-2xl">한줄 책 추천</h3>
            <form className="my-3">
              <input
                onChange={handleSearchChange}
                value={searchText}
                className="h-10 w-full rounded-md border border-gray-300 pl-3 focus:border-green-400 focus:outline-none dark:border-light-light dark:border-opacity-20 dark:bg-dark-dark"
                placeholder="추천 할 책을 검색해주세요"
              />
            </form>

            {searchedBooks && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {searchedBooks.map((searchedBook: ISearchedBook) => (
                  <div
                    onClick={() => searchedBookClick(searchedBook)}
                    className=" flex cursor-pointer  flex-col items-center rounded-lg border border-solid bg-white p-2 shadow-md dark:border-light-light dark:border-opacity-20 dark:bg-dark-dark "
                    key={searchedBook._id}
                  >
                    <img
                      className="mb-2 h-40 w-32 rounded-lg object-cover"
                      src={searchedBook.image}
                      alt={searchedBook.title}
                    />
                    <span className="line-clamp-2 text-center text-sm font-medium text-gray-700 dark:text-light-light">
                      {searchedBook.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="my-5 flex items-center bg-white pr-3 dark:border dark:border-solid dark:border-light-light dark:border-opacity-20 dark:bg-dark-dark">
              <textarea
                placeholder="책을 마음껏 추천해주세요"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                className=" h-32 w-full resize-none rounded-md  p-3 focus:outline-none  dark:bg-dark-dark "
              />
              {searchedBookData.image && (
                <>
                  <img
                    className="mr-2 h-full w-16"
                    alt={searchedBookData.title}
                    src={searchedBookData.image}
                  />
                  <FaXmark
                    className="cursor-pointer"
                    onClick={() => setSearchedBookData(initialBookData)}
                  />
                </>
              )}
            </div>
            <div
              className=" float-end w-full cursor-pointer  rounded-lg bg-green-400  p-3 text-center text-light-light lg:w-fit"
              onClick={createComment}
            >
              등록
            </div>
          </section>
          <section>
            <ul>
              {oneLines &&
                oneLines.map((oneLine: IOneLine, index: number) => (
                  <li className="mb-3 py-2" key={index}>
                    <div className="flex flex-col ">
                      <div className="flex items-center justify-between">
                        <div className="mb-4 text-sm opacity-35">
                          <span className="mr-2">
                            {oneLine.author.nickname} (
                            {maskUsername(oneLine.author.username)})
                          </span>
                          {oneLine.modifiedAt ? (
                            <span>
                              {formatDate(oneLine.modifiedAt)} (수정됨)
                            </span>
                          ) : (
                            <span>{formatDate(oneLine.createdAt)}</span>
                          )}
                        </div>

                        <div className="flex items-center">
                          {userId == oneLine.author._id && (
                            <div key={oneLine._id} className="relative">
                              <CiMenuKebab
                                onClick={() =>
                                  menuCliked(oneLine._id, oneLine.content)
                                }
                                className="size-4 cursor-pointer"
                                title="수정 or 삭제"
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
                      <div className="flex w-full items-center justify-between">
                        <span>{oneLine.content}</span>
                        {oneLine.book && (
                          <img
                            className="mr-7 h-full w-12"
                            src={oneLine.book.image}
                            alt={oneLine.book.title}
                          />
                        )}
                      </div>
                    </div>
                    {isSelectedOneLineOpen &&
                      selectedOneLineId === oneLine._id && (
                        <div className="ml-12">
                          <form className="my-3">
                            <input
                              onChange={handleUpdateSearchChange}
                              value={updateSearchText}
                              className="h-10 w-full rounded-md border border-gray-300 pl-3 focus:border-green-400 focus:outline-none dark:border-light-light dark:border-opacity-20 dark:bg-dark-dark"
                              placeholder="추천 할 책을 검색해주세요"
                            />
                          </form>

                          {updateSearchedBooks && (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                              {updateSearchedBooks.map(
                                (searchedBook: ISearchedBook) => (
                                  <div
                                    onClick={() =>
                                      updateSearchedBookClick(searchedBook)
                                    }
                                    className="flex cursor-pointer flex-col items-center rounded-lg bg-white p-2 shadow-md"
                                    key={searchedBook._id}
                                  >
                                    <img
                                      className="mb-2 h-40 w-32 rounded-lg object-cover"
                                      src={searchedBook.image}
                                      alt={searchedBook.title}
                                    />
                                    <span className="line-clamp-2 text-center text-sm font-medium text-gray-700">
                                      {searchedBook.title}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          )}

                          <div className=" mt-4 flex flex-col items-end rounded-md bg-light-light p-4 shadow-md dark:border dark:border-solid dark:border-light-light dark:border-opacity-20 dark:bg-dark-dark">
                            <div className="flex w-full items-center dark:bg-dark-dark">
                              <textarea
                                onChange={(e) =>
                                  setUpdateContent(e.target.value)
                                }
                                value={updateContent}
                                className="h-24 w-full resize-none rounded-md  bg-light-light p-2 focus:border-blue-500 focus:outline-none dark:border-opacity-20 dark:bg-dark-dark"
                              />
                              {updateSearchedBookData.image ? (
                                <img
                                  className="mx-2 h-full w-20"
                                  src={updateSearchedBookData.image}
                                  alt={updateSearchedBookData.title}
                                />
                              ) : (
                                <img
                                  className="mx-2 h-full w-20"
                                  src={oneLine.book?.image}
                                  alt={oneLine.book?.title}
                                />
                              )}

                              <FaXmark
                                className="cursor-pointer"
                                onClick={() =>
                                  setUpdateSearchedBookData(initialBookData)
                                }
                              />
                            </div>
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
