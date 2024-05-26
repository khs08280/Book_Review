import express from "express";
import {
  createBook,
  bookList,
  hotBooks,
  newBooks,
  webFictions,
  handleRecommend,
  selectedBook,
  getUserRatingForBook,
  searchBook,
} from "../controllers/bookController.js";
import { isLoggedIn } from "../middleware/loginCheck.js";
import passport from "passport";

const bookRouter = express.Router();

bookRouter.get("/", bookList);
bookRouter.get("/hot-books", hotBooks);
bookRouter.get("/new-books", newBooks);
bookRouter.get("/web-fictions", webFictions);
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
