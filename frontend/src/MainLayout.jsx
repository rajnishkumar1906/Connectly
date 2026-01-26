import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import SideNav from "./components/SideNav";
import Recommends from "./components/Recommends";
import CreatePost from "./components/CreatePost";

import Home from "./components/Home";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

const MainLayout = () => {
  const isAuthenticated = true;
  // const isAuthenticated = false;

  // Simulated logged-in user
  const currentUser = {
    id: 1,
    username: "rajnish",
    name: "Rajnish Kumar",
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  if (!isAuthenticated) return <Login />;

  const handleCreatePost = (content) => {
    const newPost = {
      id: Date.now(),
      userId: currentUser.id,
      author: currentUser.name,
      content,
      createdAt: new Date(),
    };

    setPosts([newPost, ...posts]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideNav onOpenCreate={() => setIsCreateOpen(true)} />

      <main className="flex-1 h-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route
            path="/profile"
            element={
              <Profile
                user={currentUser}
                posts={posts}
                onOpenCreate={() => setIsCreateOpen(true)}
              />
            }
          />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      <Recommends />

      <CreatePost
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreatePost}
      />
    </div>
  );
}

export default MainLayout;
