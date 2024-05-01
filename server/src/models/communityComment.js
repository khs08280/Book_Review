import mongoose from "mongoose";

const communityCommentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommunityArticle",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommunityComment = mongoose.model(
  "CommunityComment",
  communityCommentSchema,
  "communityComments"
);
export default CommunityComment;
