import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

/* AUTH */
import {
  login,
  signUp,
  logout,
  getMe,
} from "../controller/userAuth.js";

/* PROFILE */
import {
  getOwnProfile,
  getProfileByUserId,
  updateProfile,
} from "../controller/userController.js";

/* FOLLOW */
import {
  followUser,
  unfollowUser,
  checkFollow,
  getUserFollowers,
  getUserFollowing,
} from "../controller/followController.js";

/* RECOMMEND */
import { getRecommendedUsers } from "../controller/recommendsController.js";

const router = Router();

/* ================= AUTH ================= */
router.get("/me", authMiddleware, getMe);
router.post("/login", login);
router.post("/signup", signUp);
router.post("/logout", authMiddleware, logout);

/* ================= PROFILE ================= */
router.get("/retrieve-profile", authMiddleware, getOwnProfile);
router.get("/:userId/profile", getProfileByUserId);
router.patch("/update-profile", authMiddleware, updateProfile);

/* ================= FOLLOW ================= */
router.post("/follow/:userId", authMiddleware, followUser);
router.delete("/unfollow/:userId", authMiddleware, unfollowUser);
router.get("/check-follow/:userId", authMiddleware, checkFollow);

/* ================= FOLLOWERS / FOLLOWING ================= */
router.get("/followers", authMiddleware, getUserFollowers);
router.get("/followers/:userId", authMiddleware, getUserFollowers);

router.get("/following", authMiddleware, getUserFollowing);
router.get("/following/:userId", authMiddleware, getUserFollowing);

/* ================= RECOMMENDED ================= */
router.get("/recommended/list", authMiddleware, getRecommendedUsers);

export default router;
