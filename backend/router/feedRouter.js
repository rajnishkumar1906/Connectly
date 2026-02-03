import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createPost,
  getFeed,
  likePost,
  addComment,
  getComments,
  getPostsByUser,
} from "../controller/feedController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, "..", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const feedRouter = Router();
const upload = multer({
  dest: tempDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

// All feed routes require auth
feedRouter.get("/feed", authMiddleware, getFeed);
feedRouter.post("/create-post", authMiddleware, upload.single("image"), createPost);
feedRouter.get("/user/:userId/posts", getPostsByUser); // public for profile view
feedRouter.post("/post/:postId/like", authMiddleware, likePost);
feedRouter.post("/post/:postId/comment", authMiddleware, addComment);
feedRouter.get("/post/:postId/comments", authMiddleware, getComments);

export default feedRouter;
