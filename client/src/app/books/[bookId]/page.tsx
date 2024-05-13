"use client";

import Modal from "@/src/components/modal";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Home from "../../page";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const modalRef = useRef<HTMLDivElement>(null);
  const { bookId } = params;

  // 모달이 열려있는지 여부를 상태로 관리합니다.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달을 열기 위한 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달을 닫기 위한 함수
  const closeModal = () => {
    setIsModalOpen(false);
    router.push("/");
  };
  const modalClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // 모달 안의 클릭 이벤트가 상위 요소로 전파되지 않도록 함
  };

  useEffect(() => {
    if (bookId) {
      openModal();
    }
  }, [bookId]);

  return (
    <>
      <Home />
      {isModalOpen && (
        <div onClick={closeModal}>
          <Modal
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
