import express from "express";
import bookRouter from "./books.js";
import userRouter from "./users.js";
import reviewRouter from "./reviews.js";

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/books", bookRouter);
apiRouter.use("/reviews", reviewRouter);

export default apiRouter;
