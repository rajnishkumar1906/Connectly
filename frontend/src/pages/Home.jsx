import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import PostItem from "../components/PostItem";
import Avatar from "../components/ui/Avatar";
import Settings from "../components/Settings";
import { Sparkles, Settings as SettingsIcon } from "lucide-react";

const Stories = () => {
  const stories = [
    { id: 1, username: "Aarav" },
    { id: 2, username: "Isha" },
    { id: 3, username: "Rohan" },
    { id: 4, username: "Sanya" },
    { id: 5, username: "Aditya" },
  ];

  return (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white dark:bg-black p-0.5">
                <Avatar 
                  fallback={story.username} 
                  size="full"
                  className="rounded-full"
                />
              </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const { feed, fetchFeed, likePost, addComment, getComments, loading } =
    useContext(AppContext);
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Check for settings hash in URL
  useEffect(() => {
    if (location.hash === '#settings') {
      setShowSettings(true);
    } else {
      setShowSettings(false);
    }
  }, [location]);

  useEffect(() => {
    const loadFeed = async () => {
      await fetchFeed();
      setIsLoading(false);
    };
    loadFeed();
  }, [fetchFeed]);

  const handleCloseSettings = () => {
    setShowSettings(false);
    // Remove hash from URL
    window.history.replaceState(null, '', window.location.pathname);
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {/* Header with Settings Button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold">Home</h1>
          <button
            onClick={() => {
              window.location.hash = 'settings';
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            aria-label="Open settings"
          >
            <SettingsIcon size={20} />
          </button>
        </div>

        {/* Stories */}
        <Stories />

        {/* Feed */}
        {feed.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to Connectly! 👋</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Follow people to see their posts here. Start by discovering new friends!
            </p>
            <button className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium hover:opacity-80 transition">
              Discover People
            </button>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {feed.map((post) => (
              <PostItem
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseSettings}
          />
          <div className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-black rounded-xl shadow-2xl overflow-hidden">
            <Settings onClose={handleCloseSettings} />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;