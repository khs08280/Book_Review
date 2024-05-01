import express from "express";
import { createBook, home } from "../controllers/bookController.js";
import mongoose from "mongoose";

const bookRouter = express.Router();

bookRouter.get("/", home);

bookRouter.post("/books", createBook);

export default bookRouter;
