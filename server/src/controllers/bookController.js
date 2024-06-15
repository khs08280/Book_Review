import Book from "../models/book.js";
import Rating from "../models/rating.js";
import User from "../models/user.js";

export const bookList = async (req, res) => {
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

export const createBook = async (req, res) => {
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
  const userId = req.user._id;

  const { bookId, ...otherData } = req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  try {
    if (!userId || !bookId) {
      return res.status(400).json({
        success: false,
        error: "사용자 ID와 리뷰 ID를 모두 제공해야 합니다.",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다." });
    }

    const userIndex = book.recommendations.indexOf(userId);

    if (userIndex !== -1) {
      book.recommendations.splice(userIndex, 1);
    } else {
      book.recommendations.push(userId);
    }

    await book.save();

    const recommendations = book.recommendations.length;

    res.status(200).json({
      success: true,
      recommendations,
      message: "책을 추천했습니다.",
    });
  } catch (error) {
    console.error("책 추천 중 오류:", error);
    res
      .status(500)
      .json({ success: false, error: "서버 오류가 발생했습니다." });
  }
};

export const getUserRatingForBook = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user._id;

  if (!userId || !bookId) {
    return res.status(400).json("잘못된 요청입니다");
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

export const searchBook = async (req, res) => {
  const { searchText } = req.query;

  if (!searchText) {
    return res
      .status(400)
      .json({ error: "searchText query parameter is required" });
  }
  if (searchText.length < 2) {
    return res.status(400).json({ error: "검색어는 2글자 이상이어야 합니다" });
  }
  const removeSpaces = (text) => text.replace(/\s+/g, "");
  try {
    const searchTextNoSpaces = removeSpaces(searchText);
    const titleRegex = new RegExp(searchTextNoSpaces, "i");
    const authorRegex = new RegExp("^" + searchText, "i");

    const books = await Book.aggregate([
      {
        $project: {
          title: 1,
          writer: 1,
          publishedDate: 1,
          image: 1,
          titleNoSpaces: {
            $replaceAll: { input: "$title", find: " ", replacement: "" },
          },
        },
      },
      {
        $match: {
          $or: [
            { titleNoSpaces: { $regex: titleRegex } },
            { writer: { $regex: authorRegex } },
          ],
        },
      },
    ]);

    res.status(200).json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const infiniteBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 2;

  try {
    const totalCount = await Book.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const books = await Book.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("review");

    return res.status(200).json({
      data: books,
      currentPage: page,
      totalPages: totalPages,
      success: true,
      message: "페이지별 책 리스트를 불러왔습니다",
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      error: "페이지별 책 리스트를 불러오는 중 에러가 발생했습니다",
      success: false,
    });
  }
};
