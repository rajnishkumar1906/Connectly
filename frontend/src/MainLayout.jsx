import React, { useState, useEffect, useContext } from "react";
import SideNav from "./components/SideNav";
import Recommends from "./components/Recommends";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import { AppContext } from "./context/AppContext";

const MainLayout = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { fetchFeed, fetchRecommendedUsers, createPost, isAuthorised } = useContext(AppContext);

  useEffect(() => {
    if (isAuthorised) {
      fetchFeed();
      fetchRecommendedUsers();
    }
  }, [isAuthorised, fetchFeed, fetchRecommendedUsers]);

  const handleCreatePost = async (formData) => {
    const result = await createPost(formData);
    if (result?.success) {
      setIsCreateOpen(false);
    }
    return result;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideNav onOpenCreate={() => setIsCreateOpen(true)} />
      <main className="flex-1 overflow-y-auto min-w-0">
        <Home />
      </main>
      <Recommends />
      <CreatePost
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreatePost}
      />
    </div>
  );
};

export default MainLayout;
