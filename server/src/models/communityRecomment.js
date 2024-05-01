import mongoose from "mongoose";

const communityRecommentSchema = mongoose.Schema({
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
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommunityComment",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommunityRecomment = mongoose.model(
  "CommunityRecomment",
  communityRecommentSchema,
  "communityRecomments"
);
export default CommunityRecomment;
