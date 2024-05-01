import Book from "../models/book.js";
export const home = (req, res, next) => {
  res.status(200).json({
    message: "서버",
  });
};

export const createBook = async (req, res, next) => {
  const { name, writer, description } = req.body;
  const newBook = await Book.create({
    name,
    writer,
    description,
  });
  try {
    await newBook.save();
    console.log("Created", newBook);
    res.status(201).json({
      message: "Book created successfully",
      book: newBook,
    });
  } catch (e) {
    console.error("Error creating book", e);
    res.status(500).json({
      error: "Failed to create book",
    });
  }
};
