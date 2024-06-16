"use client";

import Modal from "@/src/components/modal";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Home from "../../page";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const bookId = params.get("bookId");

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

  return (
    <>
      <Home />
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
