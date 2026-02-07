import { Follow, FriendShips } from "../models/Schemas.js";

/* ================= CREATE FRIENDSHIP IF MUTUAL ================= */
export const createFriendshipIfMutual = async (userA, userB) => {
  try {
    if (!userA || !userB) return;
    if (userA.toString() === userB.toString()) return;

    const [aFollowsB, bFollowsA] = await Promise.all([
      Follow.findOne({ follower: userA, following: userB }).lean(),
      Follow.findOne({ follower: userB, following: userA }).lean(),
    ]);

    if (!aFollowsB || !bFollowsA) return;

    await Promise.all([
      FriendShips.findOneAndUpdate(
        { user: userA },
        { $addToSet: { friends: userB } },
        { upsert: true }
      ),
      FriendShips.findOneAndUpdate(
        { user: userB },
        { $addToSet: { friends: userA } },
        { upsert: true }
      ),
    ]);
  } catch (error) {
    console.error("createFriendshipIfMutual error:", error);
  }
};

/* ================= REMOVE FRIENDSHIP ================= */
export const removeFriendship = async (userA, userB) => {
  try {
    if (!userA || !userB) return;

    await Promise.all([
      FriendShips.findOneAndUpdate(
        { user: userA },
        { $pull: { friends: userB } }
      ),
      FriendShips.findOneAndUpdate(
        { user: userB },
        { $pull: { friends: userA } }
      ),
    ]);
  } catch (error) {
    console.error("removeFriendship error:", error);
  }
};

/* ================= GET FRIENDS LIST ================= */
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;

    const doc = await FriendShips.findOne({ user: userId })
      .populate("friends", "username")
      .lean();

    if (!doc || !doc.friends?.length) {
      return res.status(200).json({ friends: [] });
    }

    const friends = doc.friends.map((u) => ({
      _id: u._id,
      username: u.username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        u.username || "U"
      )}&background=3B82F6&color=fff`,
    }));

    return res.status(200).json({ friends });
  } catch (error) {
    console.error("getFriends error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= CHECK FRIEND ================= */
export const checkFriend = async (req, res) => {
  try {
    const userA = req.user.userId;
    const { userId: userB } = req.params;

    if (!userB) {
      return res.status(400).json({ friends: false });
    }

    const exists = await FriendShips.exists({
      user: userA,
      friends: userB,
    });

    return res.status(200).json({ friends: !!exists });
  } catch (error) {
    console.error("checkFriend error:", error);
    return res.status(500).json({ message: error.message });
  }
};
