import express from "express";
import {
  RReview,
  CReview,
  UReview,
  DReview,
  handleLike,
} from "../controllers/reviewController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import passport from "passport";

const reviewRouter = express.Router();

reviewRouter.get("/:bookId", RReview);
reviewRouter.post(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  CReview
);
reviewRouter.patch(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  UReview
);
reviewRouter.delete(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  DReview
);
reviewRouter.post(
  "/handleLike",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  handleLike
);

export default reviewRouter;
