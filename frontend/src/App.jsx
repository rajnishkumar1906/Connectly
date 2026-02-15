import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Servers from "./pages/Servers";
import Invite from "./pages/Invite";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";
import SplashScreen from "./components/SplashScreen";
import "react-toastify/dist/ReactToastify.css";
import Notification from "./pages/Notifications";

function ProtectedRoute({ children }) {
  const { isAuthorised, loading } = useContext(AppContext);
  const location = useLocation(); // for redirect-after-login

  if (loading) return null;

  if (!isAuthorised) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function GuestOnlyRoute({ children }) {
  const { isAuthorised, loading } = useContext(AppContext);

  if (loading) return null;

  if (isAuthorised) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function NotFoundRedirect() {
  const { isAuthorised } = useContext(AppContext);
  return <Navigate to={isAuthorised ? "/" : "/login"} replace />;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        {/* Public: login only when not authenticated */}
        <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />

        {/* Protected: main app with sidebar + feed area */}
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
          <Route path="/settings" element={<Settings />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/servers" element={<Servers />} />
          <Route path="/servers/:serverId" element={<Servers />} />
          <Route path="/servers/:serverId/:channelId" element={<Servers />} />
          <Route path="/invite/:code" element={<Invite />} />
          <Route path="/notifications" element={<Notification />} />
        </Route>

        {/* Full-page: Messages (DM) - chat needs more space */}
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/messages/:conversationId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

        {/* Catch-all: redirect to home or login */}
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </>
  );
}

export default App;