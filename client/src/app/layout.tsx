import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProviders from "../utils/react-query-provider";
import RecoilRootProvider from "../utils/recoilRoot-provider";
import { Header } from "../components/header";
import React, { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "북스 - BOOX",
  description: "북스 - BOOX 책 리뷰, 커뮤니티",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilRootProvider>
          <ReactQueryProviders>
            <Header />
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </ReactQueryProviders>
        </RecoilRootProvider>
      </body>
    </html>
  );
}
