import express from "express";
import {
  createComment,
  deleteComment,
  readComment,
  updateComment,
} from "../controllers/commentController.js";
import { isLoggedIn } from "../middleware/loginCheck.js";
import passport from "passport";

const commentRouter = express.Router();

commentRouter.post(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  createComment
);
commentRouter.get("/", readComment);
commentRouter.patch(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  updateComment
);
commentRouter.delete(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  deleteComment
);

export default commentRouter;
