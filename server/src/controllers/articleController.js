import ActivityLog from "../models/activityLog.js";
import CommunityArticle from "../models/communityArticle.js";
import CommunityComment from "../models/communityComment.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const createArticle = async (req, res) => {
  const { title, content, category, tags, ...otherData } = req.body;
  const userId = req.user._id;

  console.log(title, content, category, tags);

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      message: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  if (!title || !content) {
    return res
      .status(422)
      .json({ message: "요청에 필요한 데이터가 올바르지 않습니다." });
  }
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    const article = await new CommunityArticle({
      title,
      content,
      author: userId,
      category,
      tags,
    });
    await article.save();

    const newActivity = new ActivityLog({
      author: userId,
      type: "POST",
      referenceId: article._id,
      createdAt: new Date(),
      description: `${user.nickname}님이 게시글을 작성하셨습니다`,
      metadata: { title: article.title, content: article.content },
    });
    console.log(newActivity);
    await newActivity.save();

    user.communityArticles.push(article._id);
    await user.save();

    res
      .status(201)
      .json({ data: article, message: "게시글을 정상적으로 작성했습니다." });
  } catch (error) {
    console.error("Error creating review: ", error);
    res.status(500).json({ message: "글 생성에 실패했습니다" });
  }
};

export const readArticle = async (req, res) => {
  try {
    const articles = await CommunityArticle.find().populate(
      "author",
      "username nickname"
    );
    return res.status(200).json({
      data: articles,
      message: "모든 책 리스트를 불러왔습니다",
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      message: "게시글 리스트를 불러오는 중 에러가 발생했습니다",
    });
  }
};
export const selectedArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await CommunityArticle.findById(articleId)
      .populate("author", "username nickname")
      .lean();

    if (!article) {
      return res
        .status(404)
        .json({ message: "해당 게시글이 존재하지 않습니다" });
    }

    const comments = await CommunityComment.find({ article: articleId })
      .populate({
        path: "author",
        select: "username nickname",
      })
      .lean();

    const commentMap = {};
    comments.forEach((comment) => {
      commentMap[comment._id] = {
        author: comment.author,
        content: comment.content,
        createdAt: comment.createdAt,
        likes: comment.likes,
        _id: comment._id,
        children: [],
      };
    });

    const rootComments = [];
    comments.forEach((comment) => {
      if (comment.parentComment) {
        commentMap[comment.parentComment].children.push(
          commentMap[comment._id]
        );
      } else {
        rootComments.push(commentMap[comment._id]);
      }
    });

    await CommunityArticle.findByIdAndUpdate(articleId, { $inc: { view: 1 } });
    if (!article.category) {
      article.category = "자유";
    }

    article.comments = rootComments.map((comment) => ({
      author: comment.author,
      content: comment.content,
      createdAt: comment.createdAt,
      children: comment.children,
      likes: comment.likes,
      _id: comment._id,
    }));

    res.status(200).json({ data: article });
  } catch (error) {
    console.error("Error fetching article: ", error);
    res.status(500).json({ message: "에러가 발생했습니다." });
  }
};

export const selectedCategoryArticle = async (req, res) => {
  const { category } = req.params;
  try {
    const articles = await CommunityArticle.find({
      category: category,
    });
    if (!articles.length) {
      return res
        .status(404)
        .json({ message: "No articles found for this category." });
    }

    res.status(200).json({ data: articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateArticle = async (req, res) => {
  const { title, content, tags, articleId, ...otherData } = req.body;
  const userId = req.user._id;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      message: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  if (!title || !content) {
    return res
      .status(422)
      .json({ message: "요청에 필요한 데이터가 올바르지 않습니다." });
  }
  try {
    const article = await CommunityArticle.findById(articleId);

    if (!article) {
      return res.status(404).json({
        message: "해당 게시글을 찾을 수 없습니다.",
      });
    }

    if (article.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "이 게시글을 수정할 권한이 없습니다.",
      });
    }

    article.title = title;
    article.content = content;
    if (tags) {
      article.tags = tags;
    }
    article.modifiedAt = Date.now();

    await article.save();

    res.status(200).json({
      data: article,
      message: "게시글을 정상적으로 업데이트했습니다.",
    });
  } catch (error) {
    console.error("Error updating article: ", error);
    res.status(500).json({
      message: "게시글 업데이트 중 에러가 발생했습니다.",
    });
  }
};

export const deleteArticle = async (req, res) => {
  const { articleId, ...otherData } = req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      message: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  try {
    const article = await CommunityArticle.findById(articleId);

    if (!article) {
      return res.status(404).json({
        message: "해당 게시글을 찾을 수 없습니다",
      });
    }

    await User.updateOne(
      { _id: article.author },
      { $pull: { communityArticles: articleId } }
    );

    await CommunityComment.deleteMany({ article: articleId });
    await ActivityLog.deleteMany({ referenceId: articleId });

    await CommunityArticle.findByIdAndDelete(articleId);

    res.status(200).json({ message: "해당 게시글이 삭제되었습니다" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "게시글 삭제 중 에러가 발생했습니다" });
  }
};

export const handleArticleLike = async (req, res) => {
  const userId = req.user._id;

  const { articleId, ...otherData } = req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  try {
    if (!userId || !articleId) {
      return res.status(400).json({
        success: false,
        error: "사용자 ID와 리뷰 ID를 모두 제공해야 합니다.",
      });
    }

    const article = await CommunityArticle.findById(articleId);

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다." });
    }

    const userIndex = article.likes.indexOf(userId);

    if (userIndex !== -1) {
      article.likes.splice(userIndex, 1);
    } else {
      article.likes.push(userId);
    }

    await article.save();

    const likes = article.likes.length;

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
