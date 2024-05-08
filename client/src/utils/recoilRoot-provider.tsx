"use client";
import { CookiesProvider } from "react-cookie";
import { RecoilRoot } from "recoil";

export default function RecoilRootProvider({
  children,
}: React.PropsWithChildren) {
  return (
    <CookiesProvider>
      <RecoilRoot>{children}</RecoilRoot>
    </CookiesProvider>
  );
}
