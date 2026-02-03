import User from "../models/User.js";
import { Follow } from "../models/Schemas.js";

/* ================= RECOMMENDED USERS (not following, not self) ================= */
export const getRecommendedUsers = async (req, res) => {
  try {
    const userId = req.user.userId;

    const following = await Follow.find({ follower: userId }).select("following").lean();
    const followingIds = following.map((f) => f.following.toString());
    const excludeIds = [...followingIds, userId.toString()];

    const users = await User.find({ _id: { $nin: excludeIds } })
      .select("_id username")
      .limit(20)
      .lean();

    const list = users.map((u) => ({
      _id: u._id,
      username: u.username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username || "U")}&background=3B82F6&color=fff`,
    }));

    return res.status(200).json({ users: list });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
