import ActivityLog from "../models/activityLog.js";
import CommunityArticle from "../models/communityArticle.js";
import CommunityComment from "../models/communityComment.js";
import User from "../models/user.js";

export const createComment = async (req, res) => {
  const { content, articleId, parentCommentId, ...otherData } = req.body;
  const userId = req.user._id;

  // 유효하지 않은 데이터 체크
  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      message: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  // 필수 데이터 체크
  if (!content) {
    return res
      .status(422)
      .json({ message: "요청에 필요한 데이터가 올바르지 않습니다." });
  }

  try {
    // 유저 체크
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    // 게시글 체크
    const article = await CommunityArticle.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 부모 댓글 체크
    let parentComment;
    if (parentCommentId) {
      parentComment = await CommunityComment.findById(parentCommentId);
      if (!parentComment) {
        return res
          .status(404)
          .json({ message: "부모 댓글을 찾을 수 없습니다." });
      }
    }

    // 새로운 댓글 생성
    const newComment = new CommunityComment({
      content,
      author: userId,
      article: articleId,
      parentComment: parentCommentId || null,
    });

    await newComment.save();

    // 부모 댓글이 없는 경우 게시글에 댓글 추가
    if (!parentCommentId) {
      article.comments.push(newComment._id);
      await article.save();
    }

    // 유저 댓글 목록에 추가
    user.communityComments.push(newComment._id);
    await user.save();

    const newActivity = new ActivityLog({
      author: userId,
      type: "COMMENT",
      referenceId: newComment._id,
      createdAt: new Date(),
      description: `${user.nickname}님이 게시글에 댓글을 작성하셨습니다`,
      metadata: { content: newComment.content, article: articleId },
    });
    console.log(newActivity);
    await newActivity.save();

    res.status(201).json({
      data: newComment,
      message: "댓글이 정상적으로 작성되었습니다.",
    });
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

const deleteChildComments = async (commentIds) => {
  for (const commentId of commentIds) {
    const comment = await CommunityComment.findById(commentId);
    if (comment.children.length > 0) {
      await deleteChildComments(comment.children);
    }
    await User.updateOne(
      { _id: comment.author },
      { $pull: { communityComments: commentId } }
    );
    await CommunityComment.findByIdAndDelete(commentId);
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
    if (comment.children.length > 0) {
      await deleteChildComments(comment.children);
    }

    if (comment.parentComment) {
      const parentComment = await CommunityComment.findById(
        comment.parentComment
      );
      parentComment.children.pull(commentId);
      await parentComment.save();
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

export const handleCommentLike = async (req, res) => {
  const userId = req.user._id;

  const { commentId, ...otherData } = req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  try {
    if (!userId || !commentId) {
      return res.status(400).json({
        success: false,
        error: "사용자 ID와 댓글 ID를 모두 제공해야 합니다.",
      });
    }

    const comment = await CommunityComment.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다." });
    }

    const userIndex = comment.likes.indexOf(userId);

    if (userIndex !== -1) {
      comment.likes.splice(userIndex, 1);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    const likes = comment.likes.length;

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
