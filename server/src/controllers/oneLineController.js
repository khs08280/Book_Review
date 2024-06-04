import OneLine from "../models/oneLineRecommend.js";
import User from "../models/user.js";
import Book from "../models/book.js";
import ActivityLog from "../models/activityLog.js";

export const createOneLine = async (req, res) => {
  const { content, bookId, ...otherData } = req.body;
  const userId = req.user._id;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      message: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  if (!content || content.length > 150) {
    return res
      .status(400)
      .json({ message: "글의 길이가 150자 이하여야 합니다." });
  }

  if (!content) {
    return res.status(400).json({ message: "올바르지 않은 요청입니다." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "해당 유저를 찾지 못하였습니다." });
    }

    if (bookId) {
      const book = await Book.findById(bookId);
      if (!book) {
        return res
          .status(404)
          .json({ message: "해당 책을 찾지 못하였습니다." });
      }
    }

    const oneLineData = {
      content,
      book: bookId,
      author: userId,
    };
    const newOneLine = new OneLine(oneLineData);
    await newOneLine.save();

    const newActivity = new ActivityLog({
      author: userId,
      type: "ONE_LINE",
      referenceId: newOneLine._id,
      createdAt: new Date(),
      description: `${user.nickname}님이 한줄 책 추천을 작성하셨습니다`,
      metadata: { content: newOneLine.content },
    });
    console.log(newActivity);
    await newActivity.save();

    user.oneLineRecommends.push(newOneLine._id);
    await user.save();

    res.status(201).json({ data: newOneLine });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "에러가 발생했습니다." });
  }
};
export const readOneLine = async (req, res) => {
  try {
    const oneLines = await OneLine.find().populate(
      "author",
      "username nickname"
    );
    return res.status(200).json({
      data: oneLines,
      message: "모든 한줄 책 추천 리스트를 불러왔습니다",
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      message: "한줄 책 추천 리스트를 불러오는 중 에러가 발생했습니다",
    });
  }
};
export const updateOneLine = async (req, res) => {
  const { content, oneLineId, ...otherData } = req.body;
  const userId = req.user._id;

  if (!oneLineId || !content) {
    return res.status(422).json({
      message: "요청에 필요한 데이터가 올바르지 않습니다.",
    });
  }

  try {
    const oneLine = await OneLine.findById(oneLineId);
    if (!oneLine) {
      return res
        .status(404)
        .json({ message: "수정 할 추천 글을 찾을 수 없습니다." });
    }

    if (oneLine.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "추천 글을 수정할 권한이 없습니다." });
    }

    oneLine.content = content;
    oneLine.modifiedAt = Date.now();
    await oneLine.save();

    res.status(200).json({
      data: oneLine,
      message: "댓글이 정상적으로 업데이트되었습니다.",
    });
  } catch (error) {
    console.error("Error updating comment: ", error);
    res
      .status(500)
      .json({ message: "추천 글 업데이트 중 에러가 발생했습니다." });
  }
};
export const deleteOneLine = async (req, res) => {
  const { oneLineId, ...otherData } = req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      message: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  try {
    const oneLine = await OneLine.findById(oneLineId);

    if (!oneLine) {
      return res.status(404).json({
        message: "해당 글을 찾을 수 없습니다",
      });
    }

    await User.updateOne(
      { _id: oneLine.author },
      { $pull: { oneLineRecommends: oneLineId } }
    );

    await OneLine.findByIdAndDelete(oneLineId);

    res.status(200).json({ message: "해당 추천 글이 삭제되었습니다" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "추천 글 삭제 중 에러가 발생했습니다" });
  }
};
