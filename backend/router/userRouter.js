import { Router } from "express";
import {
  signUp,
  login,
  logout,
  getMe,
  showUsers,
  deleteUser,
} from "../controller/userAuth.js";
import {
  retrieveProfileData,
  updateProfile,
  getUserById,
  getProfileByUserId,
} from "../controller/userController.js";
import {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  checkFollow,
} from "../controller/followController.js";
import { getRecommendedUsers } from "../controller/recommends.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = Router();

// PUBLIC
userRouter.post("/signup", signUp);
userRouter.post("/login", login);

// PROTECTED - specific paths first (before /:userId)
userRouter.get("/me", authMiddleware, getMe);
userRouter.post("/logout", authMiddleware, logout);
userRouter.get("/show-users", authMiddleware, showUsers);
userRouter.delete("/delete-user", authMiddleware, deleteUser);
userRouter.patch("/update-profile", authMiddleware, updateProfile);
userRouter.get("/retrieve-profile", authMiddleware, retrieveProfileData);
userRouter.get("/recommended/list", authMiddleware, getRecommendedUsers);
userRouter.post("/follow/:userId", authMiddleware, followUser);
userRouter.delete("/unfollow/:userId", authMiddleware, unfollowUser);
userRouter.get("/check-follow/:userId", authMiddleware, checkFollow);
userRouter.get("/following", authMiddleware, (req, res, next) => {
  req.params.userId = req.user.userId;
  next();
}, getFollowing);
userRouter.get("/following/:userId", authMiddleware, getFollowing);
userRouter.get("/followers", authMiddleware, (req, res, next) => {
  req.params.userId = req.user.userId;
  next();
}, getFollowers);
userRouter.get("/followers/:userId", authMiddleware, getFollowers);
userRouter.get("/:userId/profile", authMiddleware, getProfileByUserId);
userRouter.get("/:userId", getUserById); // public user info (must be last)

export default userRouter;
