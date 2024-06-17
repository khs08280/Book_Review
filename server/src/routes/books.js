import express from "express";
import {
  createBook,
  bookList,
  handleRecommend,
  selectedBook,
  getUserRatingForBook,
  searchBook,
  infiniteBooks,
} from "../controllers/bookController.js";
import { isLoggedIn } from "../middleware/loginCheck.js";
import passport from "passport";

const bookRouter = express.Router();

bookRouter.get("/", bookList);
bookRouter.get("/all", infiniteBooks);
bookRouter.get("/searchBook", searchBook);

bookRouter.post("/", createBook);
bookRouter.post("/recommend", handleRecommend);

bookRouter.get(
  "/:bookId/rating",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  getUserRatingForBook
);
bookRouter.get("/:bookId", selectedBook);

export default bookRouter;
