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

  /* ---------------- CLOSE LOGOUT POPOVER ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  /* ---------------- NAV ITEMS ---------------- */
  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Messages", path: "/messages", icon: MessageCircle },
    { label: "Discover", path: "/discover", icon: Compass },
    { label: "Create", isCreate: true, icon: PlusSquare },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Settings", path: "/settings", icon: Settings }
  ];

  /* ---------------- ACTIVE CHECK ---------------- */
  const isActive = (path) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-72 border-r bg-white h-screen flex flex-col">

      {/* ---------------- LOGO ---------------- */}
      <div className="p-4 border-b flex justify-center">
        <Link to="/">
          <img src="/connectly.svg" alt="Connectly" className="h-9" />
        </Link>
      </div>

      {/* ---------------- USER INFO ---------------- */}
      {user && (
        <div className="p-4 flex items-center gap-3 border-b">
          <Avatar fallback={user.username} src={user.avatar} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      )}

      {/* ---------------- NAV ---------------- */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, path, icon: Icon, isCreate }) => {
          const active = isActive(path);

          const baseClass =
            "flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium";

          const activeClass = active
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-50";

          const content = (
            <>
              <span className="relative">
                <Icon size={22} />
                {label === "Notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[11px] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </>
          );

          if (isCreate) {
            return (
              <button
                key={label}
                onClick={onOpenCreate}
                className={`${baseClass} ${activeClass} w-full`}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={label}
              to={path}
              className={`${baseClass} ${activeClass}`}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      {/* ---------------- LOGOUT ---------------- */}
      <div className="p-3 border-t relative">
        <button
          onClick={() => setShowLogout((p) => !p)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full"
        >
          <LogOut size={22} />
          <span>Log out</span>
        </button>

        {showLogout && (
          <div
            ref={popoverRef}
            className="absolute left-4 bottom-16 w-64 bg-white border rounded-xl shadow-lg p-4 z-50"
          >
            <p className="font-semibold text-sm mb-1">Log out?</p>
            <p className="text-xs text-gray-500 mb-4">
              You’ll need to log in again.
            </p>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideNav;
