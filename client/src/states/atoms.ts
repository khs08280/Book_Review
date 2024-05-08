import { atom } from "recoil";

const sessionStorage =
  typeof window !== "undefined" ? window.sessionStorage : undefined;

export const loginStateAtom = atom({
  key: "LoginState",
  default: {},
});
export const isLoggedInAtom = atom({
  key: "isLoggedIn",
  default: false,
});
