"use client";
import { RecoilRoot } from "recoil";

export default function RecoilRootProvider({
  children,
}: React.PropsWithChildren) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
