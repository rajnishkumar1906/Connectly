import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createUploader } from "../middleware/upload.js";

import {
  createPost,
  getFeed,
  likePost,
  addComment,
  getComments,
  getPostsByUser,
  deletePost,
} from "../controller/feedController.js";

const router = Router();

// create uploader for posts
const postUpload = createUploader("posts");

router.get("/feed", authMiddleware, getFeed);

router.post(
  "/create-post",
  authMiddleware,
  postUpload.single("image"),
  createPost
);

router.get("/user/:userId/posts", getPostsByUser);
router.post("/post/:postId/like", authMiddleware, likePost);
router.post("/post/:postId/comment", authMiddleware, addComment);
router.get("/post/:postId/comments", authMiddleware, getComments);
router.delete("/post/:postId", authMiddleware, deletePost);

export default router;
