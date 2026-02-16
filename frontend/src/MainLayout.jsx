import React, { useState, useEffect, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import SideNav from "./components/SideNav";
import Recommends from "./components/Recommends";
import CreatePost from "./components/CreatePost";
import { AppContext } from "./context/AppContext";

const MainLayout = () => {
  const location = useLocation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const { 
    fetchFeed, 
    fetchRecommendedUsers, 
    createPost, 
    isAuthorised,
    theme 
  } = useContext(AppContext);

  useEffect(() => {
    if (isAuthorised) {
      fetchFeed();
      fetchRecommendedUsers();
    }
  }, [isAuthorised, fetchFeed, fetchRecommendedUsers]);

  const handleCreatePost = async (formData) => {
    const result = await createPost(formData);
    if (result?.success) setIsCreateOpen(false);
    return result;
  };

  const isFullWidthPage = () => {
    const path = location.pathname;
    return (
      path.startsWith("/servers") ||
      path.startsWith("/messages") ||
      path.startsWith("/settings") ||
      path.startsWith("/invite")
    );
  };

  if (isFullWidthPage()) {
    return (
      <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none"
          style={{
            backgroundImage: theme === 'dark' 
              ? 'url(/bg.png)' 
              : 'url(/light.png)'
          }}
        />
        <main className="relative z-10 h-full overflow-y-auto bg-white/95 dark:bg-black/95">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Background Image - Very Subtle */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: theme === 'dark' 
            ? 'url(/bg.png)' 
            : 'url(/light.png)',
        }}
      />

      {/* Content with solid backgrounds */}
      <div className="relative z-10 flex w-full">
        {/* SideNav */}
        <SideNav
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          onOpenCreate={() => setIsCreateOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <button 
              onClick={() => setIsNavOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg">Connectly</span>
            <div className="w-10" />
          </div>

          {/* Main Content with Recommendations */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main Feed - White background for readability */}
            <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
              <div className="max-w-2xl mx-auto">
                <Outlet />
              </div>
            </main>

            {/* Right Sidebar - Recommendations */}
            <div className="hidden lg:block w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
              <Recommends />
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePost
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreatePost}
      />
    </div>
  );
};

export default MainLayout;