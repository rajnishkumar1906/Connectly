import { Follow } from "../models/Schemas.js";
import User from "../models/User.js";
import {
  createFriendshipIfMutual,
  removeFriendship,
} from "./connectionController.js";
import Notification from "../models/Notification.js";

/* ================= FOLLOW USER ================= */
export const followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { userId: followingId } = req.params;

    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const userExists = await User.findById(followingId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (alreadyFollowing) {
      return res.status(200).json({ following: true });
    }

    /* CREATE FOLLOW */
    await Follow.create({
      follower: followerId,
      following: followingId,
    });

    /* CREATE FRIENDSHIP IF MUTUAL */
    await createFriendshipIfMutual(followerId, followingId);

    /* REMOVE OLD FOLLOW NOTIFICATIONS */
    await Notification.deleteMany({
      user: followingId,
      sender: followerId,
      type: "follow",
    });

    /* CREATE NEW NOTIFICATION */
    await Notification.create({
      user: followingId,
      sender: followerId,
      type: "follow",
      message: "started following you",
    });

    return res.status(201).json({
      following: true,
      message: "Followed successfully",
    });
  } catch (error) {
    console.error("followUser error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= UNFOLLOW USER ================= */
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { userId: followingId } = req.params;

    await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    /* REMOVE FRIENDSHIP IF EXISTS */
    await removeFriendship(followerId, followingId);

    return res.status(200).json({
      following: false,
      message: "Unfollowed successfully",
    });
  } catch (error) {
    console.error("unfollowUser error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET FOLLOWING ================= */
export const getUserFollowing = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;

    const list = await Follow.find({ follower: userId })
      .populate("following", "username")
      .lean();

    const following = list.map((f) => ({
      _id: f.following._id,
      username: f.following.username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        f.following.username || "U"
      )}&background=3B82F6&color=fff`,
    }));

    return res.status(200).json({ following });
  } catch (error) {
    console.error("getUserFollowing error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET FOLLOWERS ================= */
export const getUserFollowers = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;

    const list = await Follow.find({ following: userId })
      .populate("follower", "username")
      .lean();

    const followers = list.map((f) => ({
      _id: f.follower._id,
      username: f.follower.username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        f.follower.username || "U"
      )}&background=3B82F6&color=fff`,
    }));

    return res.status(200).json({ followers });
  } catch (error) {
    console.error("getUserFollowers error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= CHECK FOLLOW ================= */
export const checkFollow = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { userId: followingId } = req.params;

    const exists = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });

    return res.status(200).json({ following: !!exists });
  } catch (error) {
    console.error("checkFollow error:", error);
    return res.status(500).json({ message: error.message });
  }
};
