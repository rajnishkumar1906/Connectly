import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  LogOut,
  Home,
  User,
  MessageCircle,
  Settings,
  PlusSquare,
  Compass,
  Users,
  X
} from "lucide-react";

import { AppContext } from "../context/AppContext";
import Avatar from "./ui/Avatar";
import ConfirmLogoutModal from "./ConfirmLogoutModal";

const SideNav = ({ isOpen = false, onClose = () => {}, onOpenCreate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, unreadCount } = useContext(AppContext);
  const [showLogout, setShowLogout] = useState(false);

  // Close mobile nav when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname, isOpen, onClose]);

  const handleLogout = () => setShowLogout(true);

  const confirmLogout = async () => {
    setShowLogout(false);
    await logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Communities", path: "/servers", icon: Users },
    { label: "Messages", path: "/messages", icon: MessageCircle },
    { label: "Discover", path: "/discover", icon: Compass },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Settings", path: "/", icon: Settings, isSettings: true }
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (item, e) => {
    if (item.isSettings) {
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        window.location.hash = 'settings';
      }, 100);
    }
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar with Glassmorphism */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 glass-panel
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/20 dark:border-white/5">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white" onClick={onClose}>
              Connectly
            </Link>
            <button 
              className="lg:hidden p-1 hover:bg-white/20 rounded-lg transition text-gray-700 dark:text-gray-300"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Create Post Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onOpenCreate();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition shadow-lg glass-glow"
          >
            <PlusSquare size={18} />
            <span>Create</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSettings = item.isSettings;
            
            if (isSettings) {
              return (
                <button
                  key={item.label}
                  onClick={(e) => handleNavClick(item, e)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all
                    ${location.pathname === '/' && location.hash === '#settings'
                      ? "glass-heavy text-gray-900 dark:text-white"
                      : "glass-button text-gray-700 dark:text-gray-300 hover:glass-heavy"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all
                  ${isActive(item.path)
                    ? "glass-heavy text-gray-900 dark:text-white"
                    : "glass-button text-gray-700 dark:text-gray-300 hover:glass-heavy"
                  }
                `}
              >
                <Icon size={20} />
                <span className="flex-1">{item.label}</span>
                {item.label === "Notifications" && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        {user && (
          <div className="p-4 border-t border-white/20 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="glass-avatar-ring rounded-full">
                <Avatar 
                  src={user.avatar} 
                  fallback={user.username} 
                  size="md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 glass-button text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-lg transition-all"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </aside>

      <ConfirmLogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default SideNav;