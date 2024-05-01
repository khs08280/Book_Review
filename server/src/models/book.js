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
  },
  description: String,
});

const Book = mongoose.model("Book", bookSchema, "books");
export default Book;
