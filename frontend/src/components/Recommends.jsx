import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";

const Recommends = () => {
  const {
    user,
    recommendedUsers,
    fetchRecommendedUsers,
    followUser,
    isAuthorised,
  } = useContext(AppContext);

  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (isAuthorised) fetchRecommendedUsers();
  }, [isAuthorised, fetchRecommendedUsers]);

  const handleFollow = async (userId) => {
    if (!userId || loadingId) return;
    setLoadingId(userId);
    await followUser(userId);
    setLoadingId(null);
  };

  return (
    <aside className="hidden lg:flex w-80 flex-shrink-0 h-screen bg-black border-l border-gray-800 flex-col overflow-y-auto sticky top-0">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-900 border border-gray-800 rounded-full px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-gray-600"
          />
        </div>
      </div>

      {/* Trending */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white mb-4">Trending Now</h2>
        <div className="space-y-4">
          {[
            { tag: "#WebDev", posts: "45.2K" },
            { tag: "#Design", posts: "32.1K" },
            { tag: "#Tech", posts: "28.7K" },
            { tag: "#Startup", posts: "21.4K" },
          ].map((trend, index) => (
            <div key={index} className="p-3 hover:bg-gray-900 rounded-lg cursor-pointer">
              <div className="text-sm text-gray-400">Trending</div>
              <div className="font-bold text-white">{trend.tag}</div>
              <div className="text-sm text-gray-400">{trend.posts} posts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Who to Follow */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-white mb-4">Who to follow</h2>
        <div className="space-y-4">
          {recommendedUsers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400">No suggestions</p>
            </div>
          ) : (
            recommendedUsers.map((u) => (
              <div key={u._id} className="flex items-center justify-between p-2 hover:bg-gray-900 rounded-lg">
                <Link
                  to={`/profile/${u._id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <Avatar
                    src={u.avatar}
                    fallback={u.username}
                    size="md"
                    className="border border-gray-700"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm truncate text-white">
                      {u.username}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      Suggested for you
                    </p>
                  </div>
                </Link>

                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-full ${loadingId === u._id
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-200"
                    }`}
                  disabled={loadingId === u._id}
                  onClick={() => handleFollow(u._id)}
                >
                  {loadingId === u._id ? "..." : "Follow"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 mt-auto">
        <div className="text-xs text-gray-500 space-y-2">
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:text-gray-400">Terms</a>
            <a href="#" className="hover:text-gray-400">Privacy</a>
            <a href="#" className="hover:text-gray-400">Cookies</a>
            <a href="#" className="hover:text-gray-400">Accessibility</a>
          </div>
          <div className="text-gray-600">© 2024 Connectly</div>
        </div>
      </div>
    </aside>
  );
};

export default Recommends;