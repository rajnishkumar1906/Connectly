import React, { useState } from "react";

const Home = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "Aarav",
        username: "aarav",
        avatar: "https://ui-avatars.com/api/?name=Aarav&background=EC4899&color=fff",
      },
      image: "https://picsum.photos/600/600?random=1",
      caption: "Beautiful sunset at the beach 🌅",
      likes: 0,
      comments: 0,
      timestamp: "2 hours ago",
      isLiked: false,
      isSaved: false,
    },
    {
      id: 2,
      user: {
        name: "Ananya",
        username: "ananya",
        avatar: "https://ui-avatars.com/api/?name=Ananya&background=8B5CF6&color=fff",
      },
      image: "https://picsum.photos/600/600?random=2",
      caption: "Coffee and code ☕💻 #developer #coding",
      likes: 0,
      comments: 0,
      timestamp: "5 hours ago",
      isLiked: true,
      isSaved: false,
    },
    {
      id: 3,
      user: {
        name: "Karthik",
        username: "karthik",
        avatar: "https://ui-avatars.com/api/?name=Karthik&background=10B981&color=fff",
      },
      image: "https://picsum.photos/600/600?random=3",
      caption: "Adventure awaits! 🏔️ #hiking #nature",
      likes: 0,
      comments: 0,
      timestamp: "1 day ago",
      isLiked: false,
      isSaved: true,
    },
  ]);

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSave = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">

        {/* Stories Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 overflow-x-auto">
          <div className="flex gap-4">
            {[
              {
                name: "Your Story",
                avatar: "https://ui-avatars.com/api/?name=You&background=3B82F6&color=fff",
                isYours: true,
              },
              { name: "Riya", avatar: "https://ui-avatars.com/api/?name=Riya&background=F59E0B&color=fff" },
              { name: "Kabir", avatar: "https://ui-avatars.com/api/?name=Kabir&background=EF4444&color=fff" },
              { name: "Meera", avatar: "https://ui-avatars.com/api/?name=Meera&background=6366F1&color=fff" },
              { name: "Zoya", avatar: "https://ui-avatars.com/api/?name=Zoya&background=14B8A6&color=fff" },
              { name: "Arjun", avatar: "https://ui-avatars.com/api/?name=Arjun&background=8B5CF6&color=fff" },
            ].map((story, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1 min-w-fit cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-full p-0.5 ${
                    story.isYours
                      ? "bg-gray-300"
                      : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500"
                  }`}
                >
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-600 truncate max-w-[64px]">
                  {story.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onLike={handleLike}
              onSave={handleSave}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Post Component
const Post = ({ post, onLike, onSave }) => {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log("Comment:", comment);
      setComment("");
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-sm text-gray-900">
              {post.user.username}
            </h3>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-900 text-xl">
          •••
        </button>
      </div>

      {/* Post Image */}
      <img
        src={post.image}
        alt="Post"
        className="w-full aspect-square object-cover"
      />

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={() => onLike(post.id)}>
              {post.isLiked ? "❤️" : "🤍"}
            </button>
            <button>💬</button>
            <button>📤</button>
          </div>
          <button onClick={() => onSave(post.id)}>
            {post.isSaved ? "🔖" : "📑"}
          </button>
        </div>

        <p className="font-semibold text-sm mb-2">
          {post.likes.toLocaleString()} likes
        </p>

        <div className="text-sm mb-2">
          <span className="font-semibold mr-2">{post.user.username}</span>
          <span className="text-gray-700">{post.caption}</span>
        </div>

        {post.comments > 0 && (
          <button className="text-sm text-gray-500 mb-2">
            View all {post.comments} comments
          </button>
        )}

        <form
          onSubmit={handleCommentSubmit}
          className="flex items-center gap-2 pt-2 border-t border-gray-100"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent"
          />
          {comment.trim() && (
            <button className="text-sm font-semibold text-blue-600">
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};

export default Home;
