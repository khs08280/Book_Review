import express from "express";
import {
  ArticlePaging,
  ArticleSearch,
  createArticle,
  deleteArticle,
  handleArticleLike,
  readArticle,
  selectedArticle,
  selectedCategoryArticle,
  updateArticle,
} from "../controllers/articleController.js";
import { isLoggedIn } from "../middleware/loginCheck.js";
import passport from "passport";

const articleRouter = express.Router();

articleRouter.post(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  createArticle
);
articleRouter.get("/", readArticle);
articleRouter.patch(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  updateArticle
);
articleRouter.delete(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  deleteArticle
);
articleRouter.post("/handleLike", handleArticleLike);

articleRouter.get("/paging", ArticlePaging);
articleRouter.get("/searchArticle", ArticleSearch);
articleRouter.get("/:articleId", selectedArticle);
articleRouter.get("/category/:category", selectedCategoryArticle);
export default articleRouter;
