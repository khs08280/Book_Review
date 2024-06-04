import mongoose from "mongoose";

const activityLogSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["POST", "COMMENT", "REVIEW", "ONE_LINE"],
    required: true,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "type",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const ActivityLog = mongoose.model(
  "ActivityLog",
  activityLogSchema,
  "activityLogs"
);
export default ActivityLog;
