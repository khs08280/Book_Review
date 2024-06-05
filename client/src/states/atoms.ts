import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom: isLoggedInPersistAtom } = recoilPersist({
  key: "isLoggedIn",
  storage: typeof window !== "undefined" ? localStorage : undefined,
});
const { persistAtom: userPersistAtom } = recoilPersist({
  key: "loggedUserData",
  storage: typeof window !== "undefined" ? localStorage : undefined,
});

export const isLoggedInAtom = atom({
  key: "isLoggedIn",
  default: false,
  effects_UNSTABLE: [isLoggedInPersistAtom],
});

export const userAtom = atom({
  key: "userAtom",
  default: null,
  effects_UNSTABLE: [userPersistAtom],
});
