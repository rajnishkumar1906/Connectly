import fs from "fs/promises";
import { uploadImage } from "../utils/cloudinary.js";
import { Post } from "../models/Schemas.js";
import { Follow } from "../models/Schemas.js";

/* ================= CREATE POST (upload image + save to DB) ================= */
export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadImage(req.file.path);
    await fs.unlink(req.file.path).catch(() => {});

    const caption = req.body.caption || "";
    const post = await Post.create({
      user: req.user.userId,
      imageUrl: result.secure_url,
      caption,
    });

    const populated = await Post.findById(post._id).populate("user", "username");
    return res.status(201).json({
      message: "Post created successfully",
      post: {
        _id: populated._id,
        caption: populated.caption,
        imageUrl: populated.imageUrl,
        user: {
          _id: populated.user._id,
          username: populated.user.username,
        },
        likes: [],
        comments: [],
        createdAt: populated.createdAt,
      },
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    console.error(error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

/* ================= GET FEED (posts from following + self) ================= */
export const getFeed = async (req, res) => {
  try {
    const userId = req.user.userId;

    const following = await Follow.find({ follower: userId }).select("following").lean();
    const followingIds = following.map((f) => f.following);
    const feedUserIds = [...followingIds, userId];

    const posts = await Post.find({ user: { $in: feedUserIds } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("user", "username")
      .populate("likes", "username")
      .lean();

    const postsWithFlags = posts.map((p) => ({
      ...p,
      likeCount: p.likes?.length ?? 0,
      commentCount: p.comments?.length ?? 0,
      isLiked: (p.likes || []).some((l) => (typeof l === "object" ? l._id : l).toString() === userId.toString()),
      user: p.user
        ? {
            _id: p.user._id,
            username: p.user.username,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.user.username || "U")}&background=3B82F6&color=fff`,
          }
        : null,
    }));

    return res.status(200).json({ posts: postsWithFlags });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= LIKE / UNLIKE POST ================= */
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLiked = post.likes.some((id) => id.toString() === userId);
    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    return res.status(200).json({
      liked: !hasLiked,
      likeCount: post.likes.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= ADD COMMENT ================= */
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text: text.trim() });
    await post.save();

    const newComment = post.comments[post.comments.length - 1];
    const populated = await Post.findById(postId)
      .populate("comments.user", "username")
      .lean();
    const commentObj = populated.comments.find(
      (c) => c._id.toString() === newComment._id.toString()
    );

    return res.status(201).json({
      comment: {
        _id: commentObj._id,
        text: commentObj.text,
        user: commentObj.user
          ? { _id: commentObj.user._id, username: commentObj.user.username }
          : null,
        createdAt: commentObj.createdAt,
      },
      commentCount: post.comments.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET COMMENTS ================= */
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("comments.user", "username")
      .select("comments")
      .lean();

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = (post.comments || []).map((c) => ({
      _id: c._id,
      text: c.text,
      user: c.user ? { _id: c.user._id, username: c.user.username } : null,
      createdAt: c.createdAt,
    }));

    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET POSTS BY USER (for profile) ================= */
export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "username")
      .lean();

    const formatted = posts.map((p) => ({
      _id: p._id,
      imageUrl: p.imageUrl,
      caption: p.caption,
      likeCount: (p.likes || []).length,
      commentCount: (p.comments || []).length,
      createdAt: p.createdAt,
    }));

    return res.status(200).json({ posts: formatted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
