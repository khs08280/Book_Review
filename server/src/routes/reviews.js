import express from "express";
import {
  RReview,
  CReview,
  UReview,
  DReview,
} from "../controllers/reviewController.js";
import auth from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/", auth, CReview);
reviewRouter.get("/", RReview);
reviewRouter.patch("/", auth, UReview);
reviewRouter.delete("/", auth, DReview);

export default reviewRouter;
