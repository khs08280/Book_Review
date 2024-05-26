import express from "express";
import bookRouter from "./books.js";
import userRouter from "./users.js";
import reviewRouter from "./reviews.js";
import articleRouter from "./communityArticle.js";
import commentRouter from "./communityComment.js";
import oneLineRouter from "./oneLineRecommend.js";

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/books", bookRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/oneLines", oneLineRouter);

export default apiRouter;
