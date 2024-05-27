import CommunityArticle from "../models/communityArticle.js";
import User from "../models/user.js";

export const createArticle = async (req, res) => {
  const { title, content, tags, ...otherData } = req.body;
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
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    const article = await new CommunityArticle({
      title,
      content,
      author: userId,
      tags,
    });
    await article.save();

    user.communityArticles.push(article._id);
    await user.save();

    res
      .status(201)
      .json({ data: article, message: "게시글을 정상적으로 작성했습니다." });
  } catch (error) {
    console.error("Error creating review: ", error);
    res.status(500).json({ message: "리뷰 등록에 실패했습니다" });
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
    const article = await CommunityArticle.findById(
      req.params.articleId
    ).populate("author", "username nickname");
    if (!article) {
      return res
        .status(404)
        .json({ message: "해당 게시글이 존재하지 않습니다" });
    }
    article.view += 1;
    await article.save();
    res.status(200).json({ data: article });
  } catch (error) {
    res.status(500).json({ message: "에러가 발생했습니다." });
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

    await CommunityArticle.findByIdAndDelete(articleId);

    res.status(200).json({ message: "해당 게시글이 삭제되었습니다" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "게시글 삭제 중 에러가 발생했습니다" });
  }
};
