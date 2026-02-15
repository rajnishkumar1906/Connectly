import React, { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import SideNav from "./components/SideNav";
import Recommends from "./components/Recommends";
import CreatePost from "./components/CreatePost";
import { AppContext } from "./context/AppContext";

const MainLayout = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const { fetchFeed, fetchRecommendedUsers, createPost, isAuthorised } =
    useContext(AppContext);

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

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center gap-4 px-4 py-3 border-b border-gray-800">
        <button onClick={() => setIsNavOpen(true)}>
          <Menu className="w-6 h-6 text-white" />
        </button>
        <span className="font-bold text-lg">Connectly</span>
      </div>

      <div className="flex h-[calc(100%-56px)] lg:h-full">

        {/* SideNav */}
        <SideNav
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          onOpenCreate={() => {
            setIsCreateOpen(true);
            setIsNavOpen(false);
          }}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto border-x border-gray-800">
          <Outlet />
        </main>

        {/* Right Sidebar (desktop only) */}
        <div className="hidden lg:block w-80">
          <Recommends />
        </div>
      </div>

      {/* Create Post */}
      <CreatePost
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreatePost}
      />
    </div>
  );
};

export default MainLayout;
