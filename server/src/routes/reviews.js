import express from "express";
import {
  RReview,
  CReview,
  UReview,
  DReview,
  handleLike,
} from "../controllers/reviewController.js";
import auth from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.get("/:bookId", RReview);
reviewRouter.post("/", auth, CReview);
reviewRouter.patch("/", auth, UReview);
reviewRouter.delete("/", auth, DReview);
reviewRouter.post("/handleLike", auth, handleLike);

export default reviewRouter;
