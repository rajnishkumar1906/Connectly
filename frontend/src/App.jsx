import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppContext } from "./context/AppContext";
import MainLayout from "./MainLayout";

// Import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Servers from "./pages/Servers";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Discover from "./pages/Discover";
import Followers from "./components/Followers";
import Followings from "./components/Followings";
import Invite from "./pages/Invite";

const ProtectedRoute = ({ children }) => {
  const { isAuthorised, loading } = useContext(AppContext);
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Connectly...</p>
        </div>
      </div>
    );
  }
  
  return isAuthorised ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthorised, loading } = useContext(AppContext);
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthorised ? <Navigate to="/" replace /> : children;
};

function App() {
  const { theme } = useContext(AppContext);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        <Route
          path="/invite/:code"
          element={
            <PublicRoute>
              <Invite />
            </PublicRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/followers" element={<Followers />} />
          <Route path="/followings" element={<Followings />} />
          
          <Route path="/servers" element={<Servers />} />
          <Route path="/servers/:serverId" element={<Servers />} />
          <Route path="/servers/:serverId/:channelId" element={<Servers />} />
          
          <Route path="/messages" element={<Messages />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;