import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  writer: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  pubDate: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  genre: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Book = mongoose.model("Book", bookSchema, "books");
export default Book;
