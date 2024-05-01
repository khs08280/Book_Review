import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: {
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
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  description: String,
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const Book = mongoose.model("Book", bookSchema, "books");
export default Book;
