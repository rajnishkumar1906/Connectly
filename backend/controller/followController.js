import { Follow } from "../models/Schemas.js";
import User from "../models/User.js";

/* ================= FOLLOW USER ================= */
export const followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { userId: followingId } = req.params;

    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const exists = await User.findById(followingId);
    if (!exists) return res.status(404).json({ message: "User not found" });

    const existing = await Follow.findOne({ follower: followerId, following: followingId });
    if (existing) {
      return res.status(200).json({ message: "Already following", following: true });
    }

    await Follow.create({ follower: followerId, following: followingId });
    return res.status(201).json({ message: "Followed successfully", following: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= UNFOLLOW USER ================= */
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { userId: followingId } = req.params;

    await Follow.findOneAndDelete({ follower: followerId, following: followingId });
    return res.status(200).json({ message: "Unfollowed successfully", following: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET FOLLOWING LIST ================= */
export const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const list = await Follow.find({ follower: userId })
      .populate("following", "username")
      .lean();

    const users = list.map((f) => ({
      _id: f.following._id,
      username: f.following.username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(f.following.username || "U")}&background=3B82F6&color=fff`,
    }));

    return res.status(200).json({ following: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET FOLLOWERS LIST ================= */
export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const list = await Follow.find({ following: userId })
      .populate("follower", "username")
      .lean();

    const users = list.map((f) => ({
      _id: f.follower._id,
      username: f.follower.username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(f.follower.username || "U")}&background=3B82F6&color=fff`,
    }));

    return res.status(200).json({ followers: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= CHECK IF FOLLOWING ================= */
export const checkFollow = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { userId } = req.params;

    const doc = await Follow.findOne({ follower: currentUserId, following: userId });
    return res.status(200).json({ following: !!doc });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
