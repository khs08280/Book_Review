import express from "express";
import {
  createBook,
  bookList,
  hotBooks,
  newBooks,
  webFictions,
  handleRecommend,
  selectedBook,
} from "../controllers/bookController.js";
import auth from "../middleware/auth.js";

const bookRouter = express.Router();

bookRouter.get("/", bookList);
bookRouter.get("/hot-books", hotBooks);
bookRouter.get("/new-books", newBooks);
bookRouter.get("/web-fictions", webFictions);

bookRouter.post("/", createBook);
bookRouter.post("/recommend", auth, handleRecommend);

bookRouter.get("/:bookId", selectedBook);

export default bookRouter;
