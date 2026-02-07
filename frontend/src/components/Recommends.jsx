import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import { toast } from "react-toastify";

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

    try {
      setLoadingId(userId);
      await followUser(userId);
      toast.success("Followed successfully");
    } catch (err) {
      toast.error("Failed to follow user");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <aside className="hidden lg:flex w-[350px] flex-shrink-0 h-screen bg-white border-l border-gray-200 flex-col overflow-y-auto">
      {/* Current User */}
      <div className="p-6 border-b border-gray-100">
        {user && (
          <Link to={`/profile/${user._id}`} className="flex items-center gap-3 group">
            <Avatar
              src={user.avatar}
              fallback={user.username}
              size="lg"
              className="ring-2 ring-transparent group-hover:ring-blue-100 transition-all"
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600">
                {user.username}
              </h3>
              <p className="text-sm text-gray-500">View Profile</p>
            </div>
          </Link>
        )}
      </div>

      {/* Suggestions */}
      <div className="px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Suggestions For You
        </h2>
      </div>

      <div className="flex-1 px-6 space-y-4 pb-6">
        {recommendedUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No suggestions right now.</p>
          </div>
        ) : (
          recommendedUsers.map((u) => (
            <div key={u._id} className="flex items-center justify-between gap-3">
              <Link
                to={`/profile/${u._id}`}
                className="flex items-center gap-3 flex-1 min-w-0 group"
              >
                <Avatar src={u.avatar} fallback={u.username} size="md" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm truncate text-gray-900 group-hover:text-blue-600">
                    {u.username}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    Suggested for you
                  </p>
                </div>
              </Link>

              <Button
                size="sm"
                variant="ghost"
                disabled={loadingId === u._id}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 h-8"
                onClick={() => handleFollow(u._id)}
              >
                {loadingId === u._id ? "..." : "Follow"}
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="px-6 py-6 text-xs text-gray-400 border-t border-gray-100">
        <p>© 2026 Connectly</p>
      </div>
    </aside>
  );
};

export default Recommends;
