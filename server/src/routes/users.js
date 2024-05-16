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
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import { isLoggedIn, isNotLoggedIn } from "../middleware/isLoggedIn.js";
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
userRouter.get("/me", auth, myInfo);
userRouter.post("/delete-account", auth, deleteAccount);
userRouter.patch("/updateIntroduce", auth, updateIntroduce);
userRouter.patch("/updatePassword", auth, updatePassword);
userRouter.get("/refresh", reAccessToken);
userRouter.get("/refreshToLogin", refreshToLogin);

export default userRouter;
