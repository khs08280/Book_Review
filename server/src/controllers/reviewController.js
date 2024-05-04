import Review from "../models/review.js";
import User from "../models/user.js";

export const CReview = async (req, res) => {
  try {
    const { content, authorId, bookId, rating } = req.body;
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
    if (!isAuthor) {
      return res
        .status(400)
        .json({ error: "유저를 찾을 수 없습니다", success: false });
    }
    const isBookExists = await Book.findById(bookId);
    if (!isBookExists) {
      return res
        .status(404)
        .json({ error: "책을 찾을 수 없습니다", success: false });
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

    res.status(201).json({ data: review, success: true });
  } catch (error) {
    console.error("Error creating review: ", error);
    res.status(500).json({ error: "Failed to create review", success: false });
  }
};

export const RReview = async (req, res) => {
  try {
    const reviews = await Review.find().populate("author").populate("book");

    res.status(200).json({
      data: reviews,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "리뷰를 가져오는 중 에러 발생", success: false });
  }
};

export const UReview = async (req, res) => {
  const { content, reviewId } = req.body;
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
      .json({ error: "리뷰 업데이트 중 에러 발생", success: false });
  }
};
export const DReview = async (req, res) => {
  const { reviewId } = req.body;
  if (!reviewId) {
    return res.status(422).json({
      error: "요청에 필요한 reviewId가 없습니다",
      success: false,
    });
  }
  try {
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "리뷰 삭제 중 에러 발생", success: false });
  }
};
