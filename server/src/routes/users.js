import express from "express";

import {
  deleteAccount,
  updateIntroduce,
  join,
  login,
  logout,
  myInfo,
  updatePassword,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import { isLoggedIn, isNotLoggedIn } from "../middleware/isLoggedIn.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/join", join);
userRouter.get("/logout", isLoggedIn, logout);
userRouter.get("/me", auth, myInfo);
userRouter.post("/delete-account", auth, deleteAccount);
userRouter.patch("/updateIntroduce", auth, updateIntroduce);
userRouter.patch("/updatePassword", auth, updatePassword);

export default userRouter;
