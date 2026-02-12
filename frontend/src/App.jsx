import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";
import SplashScreen from "./components/SplashScreen";
import "react-toastify/dist/ReactToastify.css";
import Notification from "./pages/Notifications";

function ProtectedRoute({ children }) {
  const { isAuthorised, loading } = useContext(AppContext);

  if (loading) return null;

  if (!isAuthorised) {
    return <Navigate to="/login" replace />;
  }

  return children;
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
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected layout with nested routes */}
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
          <Route path="/notifications" element={<Notification/>} />
        </Route>

        {/* Messages has its own full-page layout */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        {/* Messages conversation detail */}
        <Route
          path="/messages/:conversationId"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;