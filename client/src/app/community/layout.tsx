import React, { Suspense } from "react";
import { Inter } from "next/font/google";
import { Header } from "@/src/components/header";

const inter = Inter({ subsets: ["latin"] });

interface CommunityLayoutProps {
  children: React.ReactNode;
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  return <main>{children}</main>;
}
