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
  rating: Number,
});

const Review = mongoose.model("Review", reviewSchema, "reviews");
export default Review;
