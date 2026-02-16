import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Users } from "lucide-react";
import { AppContext } from "../context/AppContext";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";

const Recommends = () => {
  const { recommendedUsers, followUser, isAuthorised } = useContext(AppContext);
  const navigate = useNavigate();

  if (!isAuthorised) return null;

  const handleFollow = async (userId, e) => {
    e.stopPropagation();
    await followUser(userId);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleViewAll = () => {
    navigate('/discover');
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold text-lg mb-4">Suggested for you</h2>
      
      {recommendedUsers.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            No suggestions yet
          </p>
          <Button 
            onClick={handleViewAll}
            size="sm"
            className="bg-black text-white dark:bg-white dark:text-black"
          >
            Discover People
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendedUsers.slice(0, 5).map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <Avatar
                src={user.avatar}
                fallback={user.username}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.followersCount || 0} followers
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleFollow(user._id, e)}
                className="border-gray-300 dark:border-gray-600"
              >
                <UserPlus size={14} className="mr-1" />
                Follow
              </Button>
            </div>
          ))}
          
          {recommendedUsers.length > 5 && (
            <button 
              onClick={handleViewAll}
              className="w-full text-sm text-blue-500 hover:text-blue-600 py-2 transition"
            >
              View all suggestions
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Recommends;