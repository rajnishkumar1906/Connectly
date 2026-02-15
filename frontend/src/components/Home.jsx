import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import PostItem from "./PostItem";
import Avatar from "./ui/Avatar";
import { Sparkles, Search, MessageCircle } from "lucide-react";

const Stories = () => {
  const stories = [
    { id: 1, username: "Aarav" },
    { id: 2, username: "Isha" },
    { id: 3, username: "Rohan" },
    { id: 4, username: "Sanya" },
    { id: 5, username: "Aditya" },
  ];

  return (
    <div className="border-b border-gray-800 pb-3">
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center min-w-[70px]">
            <div className="w-16 h-16 rounded-full border border-gray-600 mb-2 overflow-hidden">
              <Avatar
                fallback={story.username}
                size="full"
              />
            </div>
            <p className="text-xs text-gray-400 truncate w-16 text-center">
              {story.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const { user, feed, fetchFeed, likePost, addComment, getComments } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed().finally(() => setLoading(false));
  }, [fetchFeed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
        {/* Stories */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Stories />
        </div>

        {/* Feed */}
        <div>
          {feed.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-800">
                <Sparkles className="w-8 h-8 text-gray-500 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Welcome!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Follow people to see posts here.</p>
              <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 dark:bg-white dark:text-black">
                Discover People
              </button>
            </div>
          ) : (
            <div>
              {feed.map((post) => (
                <div key={post._id} className="border-b border-gray-200 dark:border-gray-800">
                  <PostItem
                    post={post}
                    onLike={likePost}
                    onComment={addComment}
                    getComments={getComments}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    
  );
};

export default Home;
