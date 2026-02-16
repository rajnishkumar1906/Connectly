import React, { useState, useEffect } from "react";
import { X, Heart, MessageCircle, Send, Loader2 } from "lucide-react";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";

const PostModal = ({ post, onClose, onLike, onComment, getComments }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  const imageUrl = (url) => {
    if (!url) return null;
    return url?.startsWith("http") ? url : url ? `${API_URL}${url}` : null;
  };

  useEffect(() => {
    if (post?._id && getComments) {
      loadComments();
    }
  }, [post?._id]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const data = await getComments(post._id);
      setComments(data || []);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!onLike) return;
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      await onLike(post._id);
    } catch (error) {
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !onComment) return;

    setSubmitting(true);
    try {
      const newComment = await onComment(post._id, commentText);
      if (newComment) {
        setComments(prev => [...prev, newComment]);
        setCommentText("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!post) return null;

  const postUser = post.user || post.author || {};
  const displayName = postUser.firstName 
    ? `${postUser.firstName} ${postUser.lastName || ""}`.trim()
    : postUser.username || "User";

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden bg-black/60 text-white p-2 rounded-full z-10"
        >
          <X size={20} />
        </button>

        <div className="md:w-3/5 bg-black flex items-center justify-center relative">
          {post.images && post.images.length > 0 ? (
            <img
              src={imageUrl(post.images[0])}
              alt="Post"
              className="max-h-[90vh] w-full object-contain"
            />
          ) : post.image ? (
            <img
              src={imageUrl(post.image)}
              alt="Post"
              className="max-h-[90vh] w-full object-contain"
            />
          ) : (
            <div className="text-white p-8 text-center">
              <p>No image available</p>
            </div>
          )}
        </div>

        <div className="md:w-2/5 flex flex-col h-full">
          <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex items-center gap-3">
            <Avatar
              src={imageUrl(postUser.avatar)}
              fallback={displayName}
              size="md"
            />
            <div>
              <h4 className="font-bold">{displayName}</h4>
              <p className="text-sm text-gray-500">@{postUser.username}</p>
            </div>
          </div>

          <div className="p-4 border-b border-gray-300 dark:border-gray-700">
            <p className="whitespace-pre-wrap">{post.content || post.text}</p>
            {post.location && (
              <p className="text-sm text-gray-500 mt-2">📍 {post.location}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {formatDate(post.createdAt)}
            </p>
          </div>

          <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition ${
                isLiked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition">
              <MessageCircle size={20} />
              <span>{comments.length}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin" />
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={comment._id || index} className="flex gap-3">
                  <Avatar
                    src={imageUrl(comment.user?.avatar)}
                    fallback={comment.user?.firstName || comment.user?.username || "U"}
                    size="sm"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                      <p className="font-medium text-sm">
                        {comment.user?.firstName 
                          ? `${comment.user.firstName} ${comment.user.lastName || ""}`.trim()
                          : comment.user?.username || "User"}
                      </p>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No comments yet</p>
            )}
          </div>

          <form onSubmit={handleComment} className="p-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                disabled={submitting}
              />
              <Button 
                type="submit" 
                disabled={!commentText.trim() || submitting}
                size="sm"
              >
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostModal;