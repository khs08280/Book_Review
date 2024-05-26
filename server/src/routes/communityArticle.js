import express from "express";
import {
  createArticle,
  deleteArticle,
  readArticle,
  selectedArticle,
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

articleRouter.get("/:articleId", selectedArticle);
export default articleRouter;
