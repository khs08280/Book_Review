import CommunityArticle from "../models/communityArticle.js";
import CommunityComment from "../models/communityComment.js";
import User from "../models/user.js";

export const createComment = async (req, res) => {
  const { content, articleId, parentCommentId, ...otherData } = req.body;
  const userId = req.user._id;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      message: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  if (!content) {
    return res
      .status(422)
      .json({ message: "요청에 필요한 데이터가 올바르지 않습니다." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    const article = await CommunityArticle.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    let parentComment;
    if (parentCommentId) {
      parentComment = await CommunityComment.findById(parentCommentId);
      if (!parentComment) {
        return res
          .status(404)
          .json({ message: "부모 댓글을 찾을 수 없습니다." });
      }
    }

    const newComment = new CommunityComment({
      content,
      author: userId,
      article: articleId,
      parentComment: parentCommentId || null,
    });

    if (parentComment) {
      parentComment.children.push(newComment._id);
      await parentComment.save();
    }

    await newComment.save();

    user.communityComments.push(newComment._id);
    await user.save();

    res
      .status(201)
      .json({ data: newComment, message: "댓글이 정상적으로 작성되었습니다." });
  } catch (error) {
    console.error("Error creating comment: ", error);
    res.status(500).json({ message: "댓글 작성 중 에러가 발생했습니다." });
  }
};

export const readComment = async (req, res) => {
  try {
    const comments = await CommunityComment.find().populate(
      "author",
      "username nickname"
    );
    return res.status(200).json({
      data: comments,
      message: "모든 댓글 리스트를 불러왔습니다",
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      message: "댓글 리스트를 불러오는 중 에러가 발생했습니다",
    });
  }
};
export const updateComment = async (req, res) => {
  const { commentId, content } = req.body;
  const userId = req.user._id;

  if (!commentId || !content) {
    return res.status(422).json({
      message: "요청에 필요한 데이터가 올바르지 않습니다.",
    });
  }

  try {
    const comment = await CommunityComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    if (comment.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "댓글을 수정할 권한이 없습니다." });
    }

    comment.content = content;
    comment.modifiedAt = Date.now();
    await comment.save();

    res.status(200).json({
      data: comment,
      message: "댓글이 정상적으로 업데이트되었습니다.",
    });
  } catch (error) {
    console.error("Error updating comment: ", error);
    res.status(500).json({ message: "댓글 업데이트 중 에러가 발생했습니다." });
  }
};
export const deleteComment = async (req, res) => {
  const { commentId, ...otherData } = req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      message: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  try {
    const comment = await CommunityComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "해당 댓글을 찾을 수 없습니다",
      });
    }

    await User.updateOne(
      { _id: comment.author },
      { $pull: { communityComments: commentId } }
    );

    await CommunityComment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "해당 댓글이 삭제되었습니다" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "댓글 삭제 중 에러가 발생했습니다" });
  }
};
