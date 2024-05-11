import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "isLoggedIn",
  storage: typeof window !== "undefined" ? localStorage : undefined,
});

export const isLoggedInAtom = atom({
  key: "isLoggedIn",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
