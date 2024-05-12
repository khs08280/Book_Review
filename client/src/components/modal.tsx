"use client";
import React, {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

export interface ModalProps {
  children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  const router = useRouter();
  const clickedRef = useRef<EventTarget>();

  // 닫기 기능
  const onClose = useCallback(() => {
    router.back(); // 라우터 뒤로가기 기능을 이용
  }, [router]);

  function handleClickClose(e: React.MouseEvent<HTMLElement>) {
    if (clickedRef.current) {
      clickedRef.current = undefined;
      return;
    }

    e.stopPropagation();
    onClose();
  }

  return (
    // 모달 외부
    <div className={`modal_outer`} onMouseUp={handleClickClose}>
      // 모달 내부
      <div
        className={`modal_inner`}
        onMouseDown={(e) => (clickedRef.current = e.target)}
        onMouseUp={(e) => (clickedRef.current = e.target)}
      >
        {children}
        <button onClick={handleClickClose}> 닫기 </button>
      </div>
    </div>
  );
};

export default Modal;
