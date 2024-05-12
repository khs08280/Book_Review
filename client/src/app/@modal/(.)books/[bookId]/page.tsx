"use client";
import Modal from "@/src/components/modal";
import { SideBar } from "@/src/components/sideBar";
import { AnimatePresence, motion } from "framer-motion";

export default function BookModal(props: { params: { bookId: string } }) {
  const { bookId } = props.params;
  return (
    <div>
      <span className="ml-52">{bookId}</span>
    </div>
  );
}
