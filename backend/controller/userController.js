import User from "../models/User.js";
import { Profile } from "../models/Schemas.js";

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

    /* ✅ ADD avatar */
    if (req.files?.avatar?.[0]) {
      profile.avatar = `/temp/profile/${req.files.avatar[0].filename}`;
    }

    /* ✅ ADD cover */
    if (req.files?.cover?.[0]) {
      profile.coverImage = `/temp/profile/${req.files.cover[0].filename}`;
    }

    await profile.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ message: error.message });
  }
};
