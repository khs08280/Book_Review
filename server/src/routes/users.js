import express from "express";

import { join, login, logout } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/join", join);
userRouter.get("/logout", auth, logout);

export default userRouter;