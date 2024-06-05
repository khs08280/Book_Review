import ActivityLog from "../models/activityLog.js";
import User from "../models/user.js";

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

    res.status(200).json({ data: activityLogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
