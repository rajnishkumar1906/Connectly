import { Profile } from "../models/Schemas.js";

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
      state
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({ user: userId });
    }

    const { firstName, lastName, phoneNo, city, state } = req.body;

    if (firstName !== undefined) profile.firstName = firstName;
    if (lastName !== undefined) profile.lastName = lastName;
    if (phoneNo !== undefined) profile.phoneNo = phoneNo;
    if (city !== undefined) profile.city = city;
    if (state !== undefined) profile.state = state;

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
