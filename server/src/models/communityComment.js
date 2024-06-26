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
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommunityComment",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityComment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: null,
  },
});

const CommunityComment = mongoose.model(
  "CommunityComment",
  communityCommentSchema,
  "communityComments"
);
export default CommunityComment;
