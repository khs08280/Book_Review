import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProviders from "../utils/react-query-provider";
import RecoilRootProvider from "../utils/recoilRoot-provider";
import { Header } from "../components/header";
import React, { Suspense } from "react";
import Loading from "../components/loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "북스 - BOOX",
  description: "북스 - BOOX 책 리뷰, 커뮤니티",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function CommunityLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const setInitialTheme = `
  (function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })()
`;

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body className={inter.className}>
        <RecoilRootProvider>
          <ReactQueryProviders>
            <Header />
            <main>{children}</main>
          </ReactQueryProviders>
        </RecoilRootProvider>
      </body>
    </html>
  );
}
