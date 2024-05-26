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
  category: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  view: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: null,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommunityComment" }],
});

const CommunityArticle = mongoose.model(
  "CommunityArticle",
  communityArticleSchema,
  "communityArticles"
);
export default CommunityArticle;
