import express from "express";

import {
  deleteAccount,
  updateIntroduce,
  join,
  login,
  logout,
  myInfo,
  updatePassword,
  reAccessToken,
  refreshToLogin,
  followUser,
  isFollowed,
} from "../controllers/userController.js";
import { isLoggedIn, isNotLoggedIn } from "../middleware/loginCheck.js";
import passport from "passport";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/join", join);
userRouter.post(
  "/logout",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  logout
);
userRouter.get(
  "/me",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  myInfo
);
userRouter.post(
  "/delete-account",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  deleteAccount
);
userRouter.patch(
  "/updateIntroduction",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  updateIntroduce
);
userRouter.patch(
  "/updatePassword",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  updatePassword
);

userRouter.get("/refresh", isLoggedIn, reAccessToken);
userRouter.get("/refreshToLogin", refreshToLogin);

userRouter.post("/handlefollow/:targetUserId", followUser);
userRouter.get("/isFollowed/:targetUserId", isFollowed);

export default userRouter;
