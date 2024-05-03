import express from "express";
import {
  createBook,
  bookList,
  hotBooks,
  newBooks,
  webFictions,
} from "../controllers/bookController.js";

const bookRouter = express.Router();

bookRouter.get("/", bookList);
bookRouter.get("/hot-books", hotBooks);
bookRouter.get("/new-books", newBooks);
bookRouter.get("/web-fictions", webFictions);

bookRouter.post("/", createBook);

export default bookRouter;
