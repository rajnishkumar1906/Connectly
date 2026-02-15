import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Search } from "lucide-react";

const Discover = () => {
  const { recommendedUsers, fetchRecommendedUsers, followUser, isAuthorised } = useContext(AppContext);
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
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Discover People</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <Input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-100 border-gray-200 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-white"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No users found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div 
                key={user._id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <Avatar 
                    src={user.avatar} 
                    fallback={user.username} 
                    size="md" 
                    className="border border-gray-300 dark:border-gray-700"
                  />
                  <div>
                    <h4 className="font-semibold">{user.username}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Suggested for you
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleFollow(user._id)}
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
