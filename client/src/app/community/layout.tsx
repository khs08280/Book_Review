import type { Metadata } from "next";
import { Inter } from "next/font/google";

import React, { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "북스 - BOOX",
  description: "북스 - BOOX 책 리뷰, 커뮤니티",
};

export default function CommunityLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
