import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Recommends = () => {
  const {
    user,
    recommendedUsers,
    fetchRecommendedUsers,
    followUser,
    isAuthorised,
  } = useContext(AppContext);

  useEffect(() => {
    if (isAuthorised) fetchRecommendedUsers();
  }, [isAuthorised, fetchRecommendedUsers]);

  const handleFollow = async (userId) => {
    await followUser(userId);
  };

  const avatar = user
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "U")}&background=3B82F6&color=fff`
    : "";

  return (
    <aside className="w-80 flex-shrink-0 h-screen bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-gray-100">
        <Link to="/profile" className="flex items-center gap-3">
          <img
            src={avatar}
            alt="Your profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{user?.username ?? "You"}</h3>
            <p className="text-sm text-gray-500">Your Profile</p>
          </div>
        </Link>
      </div>

      <div className="px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-500">Suggestions For You</h2>
      </div>

      <div className="flex-1 px-6 space-y-4 pb-6">
        {recommendedUsers.length === 0 ? (
          <p className="text-sm text-gray-400">No suggestions right now. Follow people to see their posts in your feed.</p>
        ) : (
          recommendedUsers.map((u) => (
            <div key={u._id} className="flex items-center gap-3">
              <Link to={`/profile/${u._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={u.avatar}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm truncate">{u.username}</h3>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => handleFollow(u._id)}
                className="text-xs font-semibold text-blue-600 hover:underline flex-shrink-0"
              >
                Follow
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Recommends;
