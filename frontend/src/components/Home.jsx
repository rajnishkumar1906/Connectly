import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

/* =======================
   Utils
======================= */
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

/* =======================
   Stories
======================= */
const Stories = ({ stories }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-6 p-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center min-w-[70px]"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 p-[2px]">
              <img
                src={story.avatar}
                alt={story.username}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            <p className="text-xs mt-1 text-gray-700 truncate w-16 text-center">
              {story.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =======================
   Post
======================= */
const Post = ({ post, onLike, onComment, getComments }) => {
  const [commentText, setCommentText] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const user = post.user || {};
  const avatar =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.username || "U"
    )}&background=3B82F6&color=fff`;

  const commentCount = post.commentCount ?? post.comments?.length ?? 0;

  const loadComments = async () => {
    if (comments.length > 0) {
      setCommentsOpen(!commentsOpen);
      return;
    }
    setLoadingComments(true);
    const list = await getComments(post._id);
    setComments(list || []);
    setCommentsOpen(true);
    setLoadingComments(false);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const res = await onComment(post._id, commentText.trim());
    if (res?.success) {
      setComments((prev) => [...prev, res.comment]);
      setCommentText("");
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Link to={`/profile/${user._id}`} className="flex items-center gap-3">
          <img
            src={avatar}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">{user.username}</p>
            <p className="text-xs text-gray-500">
              {formatTime(post.createdAt)}
            </p>
          </div>
        </Link>
      </div>

      {/* Image */}
      <img
        src={post.imageUrl}
        alt="Post"
        className="w-full aspect-square object-cover bg-gray-100"
      />

      {/* Actions */}
      <div className="p-4">
        <div className="flex gap-4 mb-2">
          <button onClick={() => onLike(post._id)}>
            {post.isLiked ? "❤️" : "🤍"}
          </button>
          <button onClick={loadComments}>💬</button>
        </div>

        <p className="font-semibold text-sm mb-1">
          {(post.likeCount ?? 0).toLocaleString()} likes
        </p>

        <p className="text-sm mb-2">
          <span className="font-semibold mr-2">{user.username}</span>
          {post.caption}
        </p>

        {commentCount > 0 && (
          <button
            onClick={loadComments}
            className="text-sm text-gray-500 mb-2"
          >
            {loadingComments
              ? "Loading..."
              : `View all ${commentCount} comments`}
          </button>
        )}

        {commentsOpen && (
          <ul className="space-y-1 text-sm mb-2">
            {comments.slice(-5).map((c) => (
              <li key={c._id}>
                <span className="font-semibold mr-2">
                  {c.user?.username}
                </span>
                {c.text}
              </li>
            ))}
          </ul>
        )}

        {/* Add comment */}
        <form
          onSubmit={submitComment}
          className="flex gap-2 border-t pt-2"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
          {commentText.trim() && (
            <button className="text-blue-600 font-semibold text-sm">
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};

/* =======================
   Home
======================= */
const Home = () => {
  const { feed, fetchFeed, likePost, addComment, getComments } =
    useContext(AppContext);

  const [loading, setLoading] = useState(true);

  const stories = [
    { id: 1, username: "Rajnish", avatar: "https://ui-avatars.com/api/?name=R" },
    { id: 2, username: "Prince", avatar: "https://ui-avatars.com/api/?name=P" },
    { id: 3, username: "Albert", avatar: "https://ui-avatars.com/api/?name=A" },
    { id: 4, username: "Bhagat", avatar: "https://ui-avatars.com/api/?name=B" },
    { id: 5, username: "Vivek", avatar: "https://ui-avatars.com/api/?name=V" },
  ];

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      await fetchFeed();
      setLoading(false);
    };
    loadFeed();
  }, [fetchFeed]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4">
        {/* Stories */}
        <Stories stories={stories} />

        {/* Feed */}
        {feed.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {feed.map((post) => (
              <Post
                key={post._id}
                post={post}
                onLike={likePost}
                onComment={addComment}
                getComments={getComments}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
