import express from "express";
import {
  getActivityLogs,
  handleActivityLogLike,
} from "../controllers/activityLogController.js";

const activityLogRouter = express.Router();

activityLogRouter.get("/", getActivityLogs);
activityLogRouter.post("/handleLike", handleActivityLogLike);

export default activityLogRouter;
