import type { Metadata } from "next";
import { Inter } from "next/font/google";

import React, { Suspense } from "react";
import { Header } from "@/src/components/header";
import SnsLoading from "./loading";
import Sns from "./page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "북스 - BOOX",
  description: "북스 - BOOX 책 리뷰, 커뮤니티",
};

export default function SnsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
