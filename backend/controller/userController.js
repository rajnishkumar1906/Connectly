import User from "../models/User.js";
import { Profile } from "../models/Schemas.js";

/* ================= GET USER BY ID (public profile header) ================= */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("_id username").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "U")}&background=3B82F6&color=fff`,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET PROFILE BY USER ID (view other's profile) ================= */
export const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId }).lean();
    const user = await User.findById(userId).select("username").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({
      user: { _id: userId, username: user.username },
      profile: profile
        ? {
            firstName: profile.firstName,
            lastName: profile.lastName,
            phoneNo: profile.phoneNo,
            city: profile.city,
            state: profile.state,
            bio: profile.bio,
          }
        : null,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const retrieveProfileData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { firstName, lastName, phoneNo, city, state } = profile;

    return res.status(200).json({
      firstName,
      lastName,
      phoneNo,
      city,
      state,
      bio: profile.bio || "",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    let profile = await Profile.findOne({ user: userId });

    const { firstName, lastName, phoneNo, city, state, bio } = req.body;

    if (!profile) {
      profile = new Profile({
        user: userId,
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        phoneNo: phoneNo ?? "",
        city: city ?? "",
        state: state ?? "",
        bio: bio ?? "",
      });
    }

    if (firstName !== undefined) profile.firstName = firstName;
    if (lastName !== undefined) profile.lastName = lastName;
    if (phoneNo !== undefined) profile.phoneNo = phoneNo;
    if (city !== undefined) profile.city = city;
    if (state !== undefined) profile.state = state;
    if (bio !== undefined) profile.bio = bio;

    await profile.save();

    return res.status(200).json({
      message: "Profile saved successfully",
      profile
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// OR

// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     const { firstName, lastName, phoneNo, city, state } = req.body;

//     const updatedProfile = await Profile.findOneAndUpdate(
//       { user: userId },               
//       {
//         user: userId,                   
//         firstName,
//         lastName,
//         phoneNo,
//         city,
//         state
//       },
//       {
//         new: true,
//         upsert: true,
//         runValidators: true
//       }
//     );

//     return res.status(200).json({
//       message: "Profile saved successfully",
//       profile: updatedProfile
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
