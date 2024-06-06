import ActivityLog from "../models/activityLog.js";
import User from "../models/user.js";
import OneLine from "../models/oneLineRecommend.js";
import CommunityArticle from "../models/communityArticle.js";
import CommunityComment from "../models/communityComment.js";
import Review from "../models/review.js";
export const getActivityLogs = async (req, res) => {
  const userId = req.user._id;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const user = await User.findById(userId).populate("followings");
    const followingIds = user.followings.map((following) => following._id);

    const activityLogs = await ActivityLog.find({
      author: { $in: followingIds },
      createdAt: { $gte: oneWeekAgo },
    })
      .sort({ createdAt: -1 })
      .populate("author");

    for (const log of activityLogs) {
      if (log.referenceId) {
        const referencedItem = await getReferencedItem(
          log.referenceId,
          log.type
        );
        if (referencedItem) {
          log.metadata.likes = referencedItem.likes;
        }
      }
    }

    res.status(200).json({ data: activityLogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getReferencedItem = async (referenceId, type) => {
  let referencedItem;
  try {
    if (type === "POST") {
      referencedItem = await CommunityArticle.findById(referenceId);
    } else if (type === "COMMENT") {
      referencedItem = await CommunityComment.findById(referenceId);
    } else if (type === "REVIEW") {
      referencedItem = await Review.findById(referenceId);
    } else if (type === "ONE_LINE") {
      referencedItem = await OneLine.findById(referenceId);
    }
  } catch (error) {
    console.error("Error fetching referenced item: ", error);
  }
  return referencedItem;
};

export const handleActivityLogLike = async (req, res) => {
  const userId = req.user._id;

  const { referenceId, type, ...otherData } = req.body;

  if (Object.keys(otherData).length !== 0) {
    return res.status(400).json({
      success: false,
      error: "유효하지 않은 데이터가 포함되어 있습니다.",
    });
  }

  try {
    if (!userId || !referenceId) {
      return res.status(400).json({
        success: false,
        error: "사용자 ID와 리뷰 ID를 모두 제공해야 합니다.",
      });
    }

    let targetResource;

    if (type === "POST") {
      targetResource = await CommunityArticle.findById(referenceId);
    } else if (type === "COMMENT") {
      targetResource = await CommunityComment.findById(referenceId);
    } else if (type === "REVIEW") {
      targetResource = await Review.findById(referenceId);
    } else if (type === "ONE_LINE") {
      targetResource = await OneLine.findById(referenceId);
    } else {
      return res.status(400).json({
        success: false,
        error: "지원되지 않는 타입입니다.",
      });
    }
    if (!targetResource) {
      return res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다." });
    }

    const userIndex = targetResource.likes.indexOf(userId);
    let likes;

    if (userIndex !== -1) {
      targetResource.likes.splice(userIndex, 1);
      likes = targetResource.likes.length;
    } else {
      targetResource.likes.push(userId);
      likes = targetResource.likes.length;
    }

    await targetResource.save();

    const activityLog = await ActivityLog.findOne({ referenceId });
    if (activityLog) {
      activityLog.metadata.likes = targetResource.likes;
      await activityLog.save();
    }

    res.status(200).json({
      success: true,
      likes,
      message: "리소스에 좋아요를 추가했습니다.",
    });
  } catch (error) {
    console.error("좋아요 추가 중 오류:", error);
    res
      .status(500)
      .json({ success: false, error: "서버 오류가 발생했습니다." });
  }
};
