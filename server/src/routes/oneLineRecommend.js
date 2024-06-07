import { isLoggedIn } from "../middleware/loginCheck.js";
import passport from "passport";
import express from "express";
import {
  createOneLine,
  deleteOneLine,
  readOneLine,
  searchOneLineBook,
  updateOneLine,
} from "../controllers/oneLineController.js";

const oneLineRouter = express.Router();

oneLineRouter.post(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  createOneLine
);
oneLineRouter.get("/", readOneLine);
oneLineRouter.patch(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  updateOneLine
);
oneLineRouter.delete(
  "/",
  isLoggedIn,
  passport.authenticate("jwt", { session: false }),
  deleteOneLine
);
oneLineRouter.get("/:searchText", searchOneLineBook);

export default oneLineRouter;
