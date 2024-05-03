import express from "express";
import bookRouter from "./books.js";
import userRouter from "./users.js";

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/books", bookRouter);

export default apiRouter;
