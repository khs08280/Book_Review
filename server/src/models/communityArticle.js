import mongoose from "mongoose";

const communityArticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommunityComment" }],
});

const CommunityArticle = mongoose.model(
  "CommunityArticle",
  communityArticleSchema,
  "communityArticles"
);
export default CommunityArticle;
