import express from "express";

import { join, login } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/join", join);

export default userRouter;
