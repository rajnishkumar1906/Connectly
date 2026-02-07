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
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

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
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {userId ? (
          <Link to={`/profile/${userId}`} className="flex items-center gap-3 group">
            <Avatar
              src={user.avatar}
              fallback={user.username}
              size="md"
              className="ring-2 ring-transparent group-hover:ring-blue-100 transition-all"
            />
            <div>
              <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-600">
                {user.username}
              </p>
              <p className="text-xs text-gray-500">
                {formatTime(post.createdAt)}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar fallback="U" />
            <span className="text-sm text-gray-600">Unknown user</span>
          </div>
        )}

        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="relative aspect-square bg-gray-100">
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={handleLike}
            className={`p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors ${
              post.isLiked ? "text-red-500" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Heart size={24} fill={post.isLiked ? "currentColor" : "none"} />
          </button>

          <button
            onClick={loadComments}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <MessageCircle size={24} />
          </button>

          <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            <Send size={24} />
          </button>
        </div>

        <p className="font-semibold text-sm mb-2">
          {(post.likeCount ?? 0).toLocaleString()} likes
        </p>

        {post.caption && (
          <p className="text-sm mb-2">
            <span className="font-semibold mr-2">{user.username}</span>
            <span className="text-gray-800">{post.caption}</span>
          </p>
        )}

        {commentCount > 0 && (
          <button
            onClick={loadComments}
            className="text-sm text-gray-500 mb-2 hover:text-gray-700 font-medium"
          >
            {loadingComments ? "Loading..." : `View all ${commentCount} comments`}
          </button>
        )}

        {commentsOpen && (
          <div className="space-y-2 mb-3 max-h-60 overflow-y-auto pr-2">
            {comments.map((c) => (
              <div
                key={c._id || `${c.user?._id}-${c.createdAt}`}
                className="flex gap-2 text-sm"
              >
                <span className="font-semibold text-gray-900">
                  {c.user?.username}
                </span>
                <span className="text-gray-700">{c.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add comment */}
        <form
          onSubmit={submitComment}
          className="flex items-center gap-3 border-t border-gray-100 pt-3 mt-2"
        >
          <Input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 text-sm border-none bg-transparent focus:ring-0 px-0"
          />
          {commentText.trim() && (
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:bg-blue-50 font-semibold"
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
