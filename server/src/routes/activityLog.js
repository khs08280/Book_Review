import express from "express";
import { getActivityLogs } from "../controllers/activityLogController.js";

const activityLogRouter = express.Router();

activityLogRouter.get("/", getActivityLogs);

export default activityLogRouter;
