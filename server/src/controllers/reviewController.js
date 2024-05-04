import Review from "../models/review.js";
import User from "../models/user.js";

export const CReview = async (req, res) => {
  try {
    const { content, authorId, bookId, rating } = req.body;
    const isAuthor = await User.findById(authorId);
    if (!isAuthor) {
      return res.status(400).json({ error: "User not found", success: false });
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

    res
      .status(201)
      .json({ data: review, success: true, message: "리뷰 등록 성공" });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review", success: false });
  }
};

export const RReview = async (req, res) => {
  try {
    const reviews = await Review.find().populate("author").populate("book");

    res.status(200).json({
      data: reviews,
      success: true,
      message: "모든 리뷰 가져오기 성공",
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

  try {
    const updateReview = await Review.findByIdAndUpdate(
      reviewId,
      { content },
      { new: true }
    )
      .populate("author")
      .populate("book");

    res
      .status(201)
      .json({ data: updateReview, message: "리뷰 수정 성공", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "리뷰 업데이트 중 에러 발생", success: false });
  }
};
export const DReview = async (req, res) => {
  const { reviewId } = req.body;
  try {
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "리뷰 삭제 성공", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "리뷰 삭제 중 에러 발생", success: false });
  }
};
