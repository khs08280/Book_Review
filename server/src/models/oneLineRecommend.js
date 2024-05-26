import mongoose from "mongoose";

const oneLineSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 150,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  modifiedAt: {
    type: Date,
    default: null,
  },
});

const OneLine = mongoose.model("OneLine", oneLineSchema, "oneLines");
export default OneLine;
