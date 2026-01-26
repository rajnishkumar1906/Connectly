import React, { useState } from "react";
import { Link } from "react-router-dom";

const Recommends = () => {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      name: "Aarav",
      username: "aarav",
      avatar: "https://ui-avatars.com/api/?name=Aarav&background=F59E0B&color=fff",
      mutualFollowers: 12,
      isFollowing: false,
    },
    {
      id: 2,
      name: "Ananya",
      username: "ananya",
      avatar: "https://ui-avatars.com/api/?name=Ananya&background=EF4444&color=fff",
      mutualFollowers: 8,
      isFollowing: false,
    },
    {
      id: 3,
      name: "Karthik",
      username: "karthik",
      avatar: "https://ui-avatars.com/api/?name=Karthik&background=6366F1&color=fff",
      mutualFollowers: 5,
      isFollowing: false,
    },
    {
      id: 4,
      name: "Farah",
      username: "farah",
      avatar: "https://ui-avatars.com/api/?name=Farah&background=14B8A6&color=fff",
      mutualFollowers: 15,
      isFollowing: false,
    },
    {
      id: 5,
      name: "Imran",
      username: "imran",
      avatar: "https://ui-avatars.com/api/?name=Imran&background=8B5CF6&color=fff",
      mutualFollowers: 3,
      isFollowing: false,
    },
  ]);

  const handleFollow = (userId) => {
    setSuggestions(
      suggestions.map((user) =>
        user.id === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  return (
    <aside className="w-80 h-screen bg-white border-l border-gray-200 flex flex-col">
      {/* Profile Summary */}
      <div className="p-6 border-b border-gray-100">
        <Link to="/profile" className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff"
            alt="Your profile"
            className="w-14 h-14 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">you</h3>
            <p className="text-sm text-gray-500">Your Profile</p>
          </div>
        </Link>
      </div>

      {/* Suggestions */}
      <div className="px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-500">
          Suggestions For You
        </h2>
      </div>

      <div className="flex-1 px-6 space-y-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{user.username}</h3>
              <p className="text-xs text-gray-500">
                Followed by {user.mutualFollowers} others
              </p>
            </div>
            <button
              onClick={() => handleFollow(user.id)}
              className="text-xs font-semibold text-blue-600"
            >
              {user.isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Recommends;
