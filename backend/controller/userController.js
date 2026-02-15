import fs from "fs/promises";
import path from "path";
import User from "../models/User.js";
import { Profile } from "../models/Schemas.js";
import { uploadImage } from "../utils/cloudinary.js";

/* ================= GET USER BY ID ================= */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("_id username")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.username || "U"
        )}&background=3B82F6&color=fff`,
      },
    });
  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET PROFILE BY USER ID ================= */
export const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const [profile, user] = await Promise.all([
      Profile.findOne({ user: userId }).lean(),
      User.findById(userId).select("username").lean(),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: { _id: user._id, username: user.username },
      profile: profile || null,
    });
  } catch (error) {
    console.error("getProfileByUserId error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET OWN PROFILE ================= */
export const getOwnProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.userId,
    }).lean();

    return res.status(200).json(profile || null);
  } catch (error) {
    console.error("getOwnProfile error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  const avatarPath = req.files?.avatar?.[0]?.path;
  const coverPath = req.files?.cover?.[0]?.path;

  try {
    const userId = req.user.userId;

    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      profile = new Profile({ user: userId });
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "phoneNo",
      "city",
      "state",
      "bio",
      "website",
      "occupation",
      "education",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    /* Upload avatar to Cloudinary and save URL in DB */
    if (avatarPath) {
      const absPath = path.resolve(avatarPath);
      try {
        const result = await uploadImage(absPath);
        profile.avatar = result.secure_url;
      } finally {
        await fs.unlink(absPath).catch(() => {});
      }
    }

    /* Upload cover to Cloudinary and save URL in DB */
    if (coverPath) {
      const absPath = path.resolve(coverPath);
      try {
        const result = await uploadImage(absPath);
        profile.coverImage = result.secure_url;
      } finally {
        await fs.unlink(absPath).catch(() => {});
      }
    }

    await profile.save();

    const profileObj = profile.toObject ? profile.toObject() : profile;

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: profileObj,
    });
  } catch (error) {
    if (avatarPath) await fs.unlink(avatarPath).catch(() => {});
    if (coverPath) await fs.unlink(coverPath).catch(() => {});
    console.error("updateProfile error:", error);
    return res.status(500).json({ message: error.message });
  }
};
