import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import Input from "./ui/Input";

function formatTime(createdAt) {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now - date;

  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString();
}

const PostItem = ({ post, onLike, onComment, getComments }) => {
  const [commentText, setCommentText] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [liking, setLiking] = useState(false);

  const user = post.user ?? {};
  const userId = user._id ?? "";
  const commentCount = post.commentCount ?? post.comments?.length ?? 0;

  const loadComments = async () => {
    if (comments.length > 0) {
      setCommentsOpen(!commentsOpen);
      return;
    }

    setLoadingComments(true);
    try {
      const list = await getComments(post._id);
      setComments(Array.isArray(list) ? list : []);
      setCommentsOpen(true);
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const comment = await onComment(post._id, commentText.trim());
    if (comment) {
      setComments(prev => [...prev, comment]);
      setCommentText("");
    }
  };

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    await onLike(post._id);
    setLiking(false);
  };

  return (
    <article className="border-b border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {userId ? (
          <Link to={`/profile/${userId}`} className="flex items-center gap-3">
            <Avatar
              src={user.avatar}
              fallback={user.username}
              size="md"
              className="border border-gray-700"
            />
            <div>
              <p className="font-semibold text-sm text-white">
                {user.username}
              </p>
              <p className="text-xs text-gray-400">
                {formatTime(post.createdAt)}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar fallback="U" className="border border-gray-700" />
            <span className="text-sm text-gray-400">Unknown user</span>
          </div>
        )}

        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="relative aspect-square bg-black">
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pt-3">
          <p className="text-white">
            <span className="font-semibold mr-2">{user.username}</span>
            {post.caption}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={handleLike}
            className={`p-1 ${
              post.isLiked ? "text-red-500" : "text-gray-400 hover:text-white"
            }`}
          >
            <Heart size={24} fill={post.isLiked ? "currentColor" : "none"} />
          </button>

          <button
            onClick={loadComments}
            className="p-1 text-gray-400 hover:text-white"
          >
            <MessageCircle size={24} />
          </button>

          <button className="p-1 text-gray-400 hover:text-white">
            <Send size={24} />
          </button>
        </div>

        <p className="font-semibold text-sm text-gray-300 mb-2">
          {(post.likeCount ?? 0).toLocaleString()} likes
        </p>

        {commentCount > 0 && (
          <button
            onClick={loadComments}
            className="text-sm text-gray-400 mb-3 hover:text-white"
          >
            {loadingComments ? "Loading..." : `View ${commentCount} comments`}
          </button>
        )}

        {commentsOpen && (
          <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
            {comments.map((c) => (
              <div
                key={c._id || `${c.user?._id}-${c.createdAt}`}
                className="flex gap-2 text-sm"
              >
                <span className="font-semibold text-white">
                  {c.user?.username}
                </span>
                <span className="text-gray-300">{c.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add comment */}
        <form
          onSubmit={submitComment}
          className="flex items-center gap-2 border-t border-gray-800 pt-3"
        >
          <Input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 text-sm bg-transparent border-gray-800 text-white placeholder-gray-500"
          />
          {commentText.trim() && (
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              Post
            </Button>
          )}
        </form>
      </div>
    </article>
  );
};

export default PostItem;