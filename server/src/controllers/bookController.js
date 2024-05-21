import Book from "../models/book.js";
import Rating from "../models/rating.js";
import User from "../models/user.js";

export const bookList = async (req, res, next) => {
  try {
    const books = await Book.find().populate("review");
    return res.status(200).json({
      data: books,
      success: true,
      message: "모든 책 리스트를 불러왔습니다",
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      error: "책 리스트를 불러오는 중 에러가 발생했습니다",
      success: false,
    });
  }
};
export const selectedBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findById(bookId).populate({
      path: "review",
      populate: {
        path: "author",
        model: "User",
        select: "nickname username",
      },
    });

    if (!book) {
      return res.status(404).json({ error: "해당하는 책을 찾을 수 없습니다." });
    }

    book.review.sort((a, b) => b.likes.length - a.likes.length);

    return res.status(200).json({ data: book, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "책 불러오는 중 에러가 발생했습니다.",
    });
  }
};

export const hotBooks = (req, res) => {};
export const newBooks = (req, res) => {};
export const webFictions = (req, res) => {};

export const createBook = async (req, res, next) => {
  const {
    title,
    writer,
    image,
    publisher,
    pubDate,
    price,
    genre,
    description,
  } = req.body;
  const newBook = await Book.create({
    title,
    writer,
    image,
    publisher,
    pubDate,
    price,
    genre,
    description,
  });
  try {
    await newBook.save();
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

export const handleRecommend = async (req, res) => {
  const { userId, bookId, action, ...otherData } = req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }
    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "책을 찾을 수 없습니다." });
    }

    if (!book.recommendations) {
      book.recommendations = [];
    }

    const userIndex = user.recommendedBooks.indexOf(bookId);
    const bookIndex = book.recommendations.indexOf(userId);

    if (bookIndex !== -1) {
      user.recommendedBooks.splice(userIndex, 1);
      book.recommendations.splice(bookIndex, 1);
      await user.save();
      await book.save();
      const recommendations = book.recommendations.length;
      res.status(200).json({
        success: true,
        recommendations,
        message: "책 추천을 취소했습니다.",
      });
    } else {
      user.recommendedBooks.push(bookId);
      book.recommendations.push(userId);
      await user.save();
      await book.save();
      const recommendations = book.recommendations.length;
      res.status(200).json({
        success: true,
        recommendations,
        message: "책을 성공적으로 추천했습니다.",
      });
    }
  } catch (error) {
    console.error("책 추천 처리 중 오류:", error);
    res
      .status(500)
      .json({ success: false, error: "서버 오류가 발생했습니다." });
  }
};

export const getUserRatingForBook = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user._id;

  if (!userId || !bookId) {
    return res.status(400).send("Invalid input");
  }

  try {
    const rating = await Rating.findOne({
      author: userId,
      book: bookId,
    });

    if (rating) {
      res.status(200).json({ rating: rating.rating });
    } else {
      res.status(200).json({ rating: null });
    }
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).send(error.message);
  }
};
