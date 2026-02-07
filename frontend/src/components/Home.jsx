import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import PostItem from "./PostItem";
import Avatar from "./ui/Avatar";

/* =======================
   Stories
======================= */
const Stories = ({ stories }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-6 p-4 shadow-sm">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center min-w-[80px] cursor-pointer group"
          >
            <div
              className={`w-20 h-28 rounded-xl p-[2px] group-hover:scale-105 transition-transform duration-200 ${
                story.isSelf
                  ? "bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-400"
                  : "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400"
              }`}
            >
              <div className="w-full h-full rounded-[10px] bg-white p-[2px] overflow-hidden">
                <img
                  src={story.image}
                  alt={story.username}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
            <p className="text-xs mt-1.5 text-gray-700 truncate w-20 text-center group-hover:text-gray-900">
              {story.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =======================
   Home
======================= */
const Home = () => {
  const { user, feed, fetchFeed, likePost, addComment, getComments } =
    useContext(AppContext);

  const [loading, setLoading] = useState(true);

  // Mock stories
  const stories = [
    {
      id: "self",
      username: "Your Story",
      image: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=300&fit=crop",
      isSelf: true,
    },
    { id: 1, username: "Aarav", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=300&fit=crop" },
    { id: 2, username: "Isha", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=300&fit=crop" },
    { id: 3, username: "Rohan", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=300&fit=crop" },
    { id: 4, username: "Sanya", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop" },
    { id: 5, username: "Aditya", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop" },
    { id: 6, username: "Riya", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=300&fit=crop" },
  ];

  useEffect(() => {
    fetchFeed().finally(() => setLoading(false));
  }, [fetchFeed]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <Stories stories={stories} />

      <div className="space-y-6">
        {feed.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No posts yet. Follow people to see their posts!</p>
          </div>
        ) : (
          feed.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              onLike={likePost}
              onComment={addComment}
              getComments={getComments}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
