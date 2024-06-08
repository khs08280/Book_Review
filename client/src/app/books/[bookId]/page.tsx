"use client";

import Modal from "@/src/components/modal";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Home from "../../page";
export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { bookId } = params;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    router.back();
  };
  const modalClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (bookId) {
      openModal();
    }
  }, [bookId]);
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  // useEffect(() => {
  // const handleRouteChange = (url: string) => {
  //   setPreviousPath(url);
  // };

  // // 이전 경로를 설정합니다.
  // handleRouteChange(router.asPath);

  // // 라우터 이벤트 리스너 설정
  // router.events.on('routeChangeStart', handleRouteChange);

  // // 모달 열리면 스크롤 막기
  // document.body.style.overflow = "hidden";

  // return () => {
  //   document.body.style.overflow = "auto";
  //   router.events.off('routeChangeStart', handleRouteChange);
  //   // };
  // }, []);

  // const RenderComponent = () => {
  //   if (previousPath.startsWith("/search")) {
  //     return <Search />;
  //   }
  //   return <Home />;
  // };

  return (
    <>
      <Home />
      {/* <Search /> */}
      {isModalOpen && (
        <div onClick={closeModal}>
          <Modal
            key={bookId}
            isOpen={isModalOpen}
            onClose={closeModal}
            bookId={bookId}
            onClick={modalClickHandler}
          />
        </div>
      )}
    </>
  );
}
