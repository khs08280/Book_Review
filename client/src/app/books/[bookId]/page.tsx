"use client";
import { SideBar } from "@/src/components/sideBar";
import { AnimatePresence, motion } from "framer-motion";

export default function BookPage() {
  return (
    <>
      <SideBar />
      <span className="ml-52">This is refresh Page</span>
    </>
  );
}
