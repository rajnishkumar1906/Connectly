import mongoose from "mongoose";
import User from "../models/User.js";
import { Follow, Profile } from "../models/Schemas.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    /* ---------- Get users I already follow ---------- */
    const followingDocs = await Follow.find({ follower: userId })
      .select("following")
      .lean();

    const excludeIds = [
      userObjectId,
      ...followingDocs.map(f => f.following),
    ];

    /* ---------- Get my profile ---------- */
    const myProfile = await Profile.findOne({ user: userId })
      .select("city state")
      .lean();

    const results = [];
    const addedIds = new Set(excludeIds.map(id => id.toString()));

    /* ---------- Shared aggregation pipeline ---------- */
    const baseLookup = [
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "user",
          as: "profile",
        },
      },
      { $unwind: "$profile" },
    ];

    /* ==================================================
       1️⃣ SAME CITY + STATE
    ================================================== */
    if (myProfile?.city && myProfile?.state) {
      const sameCityUsers = await User.aggregate([
        ...baseLookup,
        {
          $match: {
            _id: { $nin: Array.from(addedIds).map(id => new mongoose.Types.ObjectId(id)) },
            "profile.city": myProfile.city,
            "profile.state": myProfile.state,
          },
        },
        { $limit: 20 },
      ]);

      sameCityUsers.forEach(u => {
        results.push(u);
        addedIds.add(u._id.toString());
      });
    }

    /* ==================================================
       2️⃣ SAME STATE
    ================================================== */
    if (results.length < 20 && myProfile?.state) {
      const sameStateUsers = await User.aggregate([
        ...baseLookup,
        {
          $match: {
            _id: { $nin: Array.from(addedIds).map(id => new mongoose.Types.ObjectId(id)) },
            "profile.state": myProfile.state,
          },
        },
        { $limit: 20 - results.length },
      ]);

      sameStateUsers.forEach(u => {
        results.push(u);
        addedIds.add(u._id.toString());
      });
    }

    /* ==================================================
       3️⃣ FALLBACK
    ================================================== */
    if (results.length < 20) {
      const fallbackUsers = await User.find({
        _id: {
          $nin: Array.from(addedIds).map(id => new mongoose.Types.ObjectId(id)),
        },
      })
        .select("_id username")
        .limit(20 - results.length)
        .lean();

      fallbackUsers.forEach(u => {
        results.push(u);
        addedIds.add(u._id.toString());
      });
    }

    /* ---------- Format response ---------- */
    const formatted = results.map(u => ({
      _id: u._id,
      username: u.username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        u.username || "U"
      )}&background=3B82F6&color=fff`,
    }));

    return res.status(200).json({ users: formatted });
  } catch (error) {
    console.error("getRecommendedUsers error:", error);
    return res.status(500).json({
      message: "Failed to fetch recommended users",
    });
  }
};
