import express from "express";

import {
  deleteAccount,
  join,
  login,
  logout,
  myInfo,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/join", join);
userRouter.get("/logout", auth, logout);
userRouter.get("/me", auth, myInfo);
userRouter.post("/delete-account", auth, deleteAccount);

export default userRouter;
