import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  isRecommended: {
    type: Boolean,
    default: false,
  },
  modifiedAt: {
    type: Date,
    default: null,
  },
  rating: {
    type: Number,
    default: null,
  },
});

const Review = mongoose.model("Review", reviewSchema, "reviews");
export default Review;
