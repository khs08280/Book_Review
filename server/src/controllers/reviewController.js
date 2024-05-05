import Book from "../models/book.js";
import Review from "../models/review.js";
import User from "../models/user.js";

export const CReview = async (req, res) => {
  try {
    const { content, authorId, bookId, rating, ...otherData } = req.body;

    if (Object.keys(otherData).length !== 0) {
      return res.status(400).json({
        success: false,
        error: "유효하지 않은 데이터가 포함되어 있습니다.",
      });
    }
    if (content.trim() == "") {
      return res
        .status(422)
        .json({ error: "아이디를 입력해주세요", success: false });
    }
    if (!content || !authorId || !bookId) {
      return res.status(422).json({
        error: "요청에 필요한 데이터가 올바르지 않습니다",
        success: false,
      });
    }

    const isAuthor = await User.findById(authorId);
    const isBookExists = await Book.findById(bookId);

    if (!isAuthor) {
      return res.status(400).json({
        error: "리뷰를 등록할 유저를 찾을 수 없습니다",
        success: false,
      });
    }
    if (!isBookExists) {
      return res
        .status(404)
        .json({ error: "리뷰를 등록할 책을 찾을 수 없습니다", success: false });
    }

    const reviewData = {
      content,
      author: authorId,
      book: bookId,
    };
    if (rating !== undefined) {
      reviewData.rating = rating;
    }

    const review = new Review(reviewData);
    await review.save();

    const user = await User.findById(authorId);
    user.review.push(review._id);
    await user.save();

    const book = await Book.findById(bookId);
    book.review.push(review._id);
    await book.save();

    res.status(201).json({ data: review, success: true });
  } catch (error) {
    console.error("Error creating review: ", error);
    res.status(500).json({ error: "리뷰 등록에 실패했습니다", success: false });
  }
};

export const RReview = async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const reviews = await Review.find({ book: bookId })
      .select("content author rating createdAt modifiedAt")
      .populate("author", "username nickname");

    res.status(200).json({
      data: reviews,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "리뷰를 가져오는 중 에러가 발생했습니다",
      success: false,
    });
  }
};

export const UReview = async (req, res) => {
  const { content, reviewId, ...otherData } = req.body;
  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }
  if (!content.trim() || !reviewId) {
    return res.status(422).json({
      error: "요청에 필요한 content 혹은 reviewId가 없습니다",
      success: false,
    });
  }

  try {
    const updateReview = await Review.findByIdAndUpdate(
      reviewId,
      { content, modifiedAt: new Date() },
      { new: true }
    )
      .populate("author")
      .populate("book");

    res.status(200).json({ data: updateReview, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "리뷰 업데이트 중 에러가 발생했습니다", success: false });
  }
};
export const DReview = async (req, res) => {
  const { reviewId, ...otherData } = req.body;
  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }
  if (!reviewId) {
    return res.status(422).json({
      error: "요청에 필요한 reviewId가 없습니다",
      success: false,
    });
  }
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        error: "해당 리뷰를 찾을 수 없습니다",
        success: false,
      });
    }

    await User.updateOne(
      { _id: review.author },
      { $pull: { review: reviewId } }
    );

    await Book.updateOne({ _id: review.book }, { $pull: { review: reviewId } });

    await Review.findByIdAndDelete(reviewId);

    res
      .status(200)
      .json({ success: true, message: "해당 리뷰가 삭제되었습니다" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "리뷰 삭제 중 에러가 발생했습니다", success: false });
  }
};

export const handleLike = async (req, res) => {
  const { userId, reviewId, ...otherData } = req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다." });
    }
    if (!review.likes) {
      review.likes = [];
    }

    const userIndex = review.likes.indexOf(userId);

    if (userIndex !== -1) {
      review.likes.splice(userIndex, 1);
    } else {
      review.likes.push(userId);
    }

    await review.save();

    const likes = review.likes.length;

    res
      .status(200)
      .json({ success: true, likes, message: "리뷰에 좋아요를 추가했습니다." });
  } catch (error) {
    console.error("좋아요 추가 중 오류:", error);
    res
      .status(500)
      .json({ success: false, error: "서버 오류가 발생했습니다." });
  }
};
