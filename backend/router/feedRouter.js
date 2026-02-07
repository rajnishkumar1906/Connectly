import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createPost,
  getFeed,
  likePost,
  addComment,
  getComments,
  getPostsByUser,
  deletePost,
} from "../controller/feedController.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, "..", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const upload = multer({
  dest: tempDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

const router = Router();

router.get("/feed", authMiddleware, getFeed);

router.post(
  "/create-post",
  authMiddleware,
  upload.single("image"),
  createPost
);
router.get("/user/:userId/posts", getPostsByUser);
router.post("/post/:postId/like", authMiddleware, likePost);
router.post("/post/:postId/comment", authMiddleware, addComment);
router.get("/post/:postId/comments", authMiddleware, getComments);
router.delete("/post/:postId", authMiddleware, deletePost);
export default router;
