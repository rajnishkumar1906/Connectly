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
  Compass
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";

const SideNav = ({ onOpenCreate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const popoverRef = useRef(null);

  const { user, logout, unreadCount } = useContext(AppContext);

  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Messages", path: "/messages", icon: MessageCircle },
    { label: "Discover", path: "/discover", icon: Compass },
    { label: "Create", isCreate: true, icon: PlusSquare },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Settings", path: "/settings", icon: Settings }
  ];

  const isActive = (path) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 border-r border-gray-800 bg-black h-screen flex flex-col sticky top-0">

      {/* LOGO */}
      <div className="p-4 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold">C</span>
          </div>
          <span className="text-xl font-bold text-white">Connectly</span>
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, path, icon: Icon, isCreate }) => {
          const active = isActive(path);
          
          if (isCreate) {
            return (
              <button
                key={label}
                onClick={onOpenCreate}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full text-left ${
                  active ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
              >
                <Icon size={22} />
                <span className="font-medium">{label}</span>
              </button>
            );
          }

          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                active ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-gray-900"
              }`}
            >
              <div className="relative">
                <Icon size={22} />
                {label === "Notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE */}
      {user && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar fallback={user.username} src={user.avatar} size="md" className="border border-gray-700" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{user.username}</p>
              <p className="text-xs text-gray-400 truncate">@{user.username}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLogout(!showLogout)}
              className="text-gray-400 hover:text-white"
            >
              <LogOut size={20} />
            </Button>
          </div>

          {/* LOGOUT POPOVER */}
          {showLogout && (
            <div
              ref={popoverRef}
              className="absolute left-4 bottom-20 w-56 bg-gray-900 border border-gray-800 rounded-lg p-4 z-50"
            >
              <p className="text-white text-sm mb-1">Log out?</p>
              <p className="text-gray-400 text-xs mb-4">You'll need to log in again.</p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 border border-gray-700"
                  onClick={() => setShowLogout(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1 bg-white text-black hover:bg-gray-200"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default SideNav;