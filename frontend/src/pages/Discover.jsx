import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Search } from "lucide-react";

const Discover = () => {
  const {
    recommendedUsers,
    fetchRecommendedUsers,
    followUser,
    isAuthorised,
  } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAuthorised) fetchRecommendedUsers();
  }, [isAuthorised, fetchRecommendedUsers]);

  const handleFollow = async (userId) => {
    await followUser(userId);
  };

  const filteredUsers = recommendedUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Discover People</h1>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
        <Input
          type="text"
          placeholder="Search people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          {filteredUsers.map((user) => (
            <div 
              key={user._id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} fallback={user.username} size="md" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{user.username}</h4>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">
                    Suggested for you
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => handleFollow(user._id)}
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;
