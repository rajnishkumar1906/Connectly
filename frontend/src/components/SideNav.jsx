import React, { useContext, useState, useRef, useEffect } from "react";
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
import Button from "./ui/Button";
import ConfirmLogoutModal from "./ConfirmLogoutModal";

const SideNav = ({ isOpen = false, onClose = () => {}, onOpenCreate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const popoverRef = useRef(null);

  const { user, logout, unreadCount } = useContext(AppContext);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const handleLogout = () => {
    setShowLogout(true);
  };

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
    { label: "Create", isCreate: true, icon: PlusSquare },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Settings", path: "/settings", icon: Settings }
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static z-50
          top-0 left-0 h-full
          w-64 bg-white text-gray-900 dark:bg-black dark:text-white border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Connectly</Link>
          <button className="lg:hidden" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, path, icon: Icon, isCreate }) =>
            isCreate ? (
              <button
                key={label}
                onClick={onOpenCreate}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-900"
              >
                <Icon size={22} /> {label}
              </button>
            ) : (
              <Link
                key={label}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive(path)
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-gray-500 hover:text-black hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-900"
                }`}
              >
                <Icon size={22} />
                {label}
                {label === "Notifications" && unreadCount > 0 && (
                  <span className="ml-auto bg-black text-white dark:bg-white dark:text-black text-xs px-2 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          )}
        </nav>

        {/* User */}
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar fallback={user.username} />
              <span className="flex-1 truncate">{user.username}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut />
              </Button>
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
