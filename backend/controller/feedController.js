import fs from "fs/promises";
import { uploadImage } from "../utils/cloudinary.js";
import { Post, Follow } from "../models/Schemas.js";

/* ================= CREATE POST ================= */
export const createPost = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await uploadImage(req.file.path);
      await fs.unlink(req.file.path).catch(() => {});
      imageUrl = result.secure_url;
    }

    const caption = req.body.caption || "";

    if (!imageUrl && !caption.trim()) {
      return res
        .status(400)
        .json({ message: "Post must contain either an image or text" });
    }

    const post = await Post.create({
      user: req.user.userId,
      imageUrl,
      caption,
    });

    const populated = await Post.findById(post._id).populate(
      "user",
      "username"
    );

    return res.status(201).json({
      message: "Post created successfully",
      post: {
        _id: populated._id,
        caption: populated.caption,
        imageUrl: populated.imageUrl,
        createdAt: populated.createdAt,
        likeCount: 0,
        commentCount: 0,
        isLiked: false,
        user: {
          _id: populated.user._id,
          username: populated.user.username,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            populated.user.username || "U"
          )}&background=3B82F6&color=fff`,
        },
      },
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    console.error(error);
    return res
      .status(500)
      .json({ message: "Upload failed", error: error.message });
  }
};

/* ================= DELETE POST ================= */
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only owner can delete
    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      postId,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET FEED ================= */
export const getFeed = async (req, res) => {
  try {
    const userId = req.user.userId;

    const following = await Follow.find({ follower: userId })
      .select("following")
      .lean();

    const feedUserIds = [
      ...following.map((f) => f.following),
      userId,
    ];

    const posts = await Post.find({ user: { $in: feedUserIds } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("user", "username")
      .populate("likes", "username")
      .lean();

    const formatted = posts.map((p) => ({
      ...p,
      likeCount: p.likes?.length ?? 0,
      commentCount: p.comments?.length ?? 0,
      isLiked: (p.likes || []).some(
        (l) =>
          (typeof l === "object" ? l._id : l).toString() ===
          userId.toString()
      ),
      user: p.user
        ? {
            _id: p.user._id,
            username: p.user.username,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              p.user.username || "U"
            )}&background=3B82F6&color=fff`,
          }
        : null,
    }));

    return res.status(200).json({ posts: formatted });
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
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const hasLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    post.likes = hasLiked
      ? post.likes.filter((id) => id.toString() !== userId)
      : [...post.likes, userId];

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

    if (!text?.trim()) {
      return res
        .status(400)
        .json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ user: userId, text: text.trim() });
    await post.save();

    const populated = await Post.findById(postId)
      .populate("comments.user", "username")
      .lean();

    const comment = populated.comments.at(-1);

    return res.status(201).json({
      comment: {
        _id: comment._id,
        text: comment.text,
        user: comment.user
          ? {
              _id: comment.user._id,
              username: comment.user.username,
            }
          : null,
        createdAt: comment.createdAt,
      },
      commentCount: populated.comments.length,
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

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = post.comments.map((c) => ({
      _id: c._id,
      text: c.text,
      user: c.user
        ? { _id: c.user._id, username: c.user.username }
        : null,
      createdAt: c.createdAt,
    }));

    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET POSTS BY USER ================= */
export const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = posts.map((p) => ({
      _id: p._id,
      imageUrl: p.imageUrl,
      caption: p.caption,
      likeCount: p.likes?.length ?? 0,
      commentCount: p.comments?.length ?? 0,
      createdAt: p.createdAt,
    }));

    return res.status(200).json({ posts: formatted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
