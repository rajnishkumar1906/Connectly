import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const SideNav = ({ onOpenCreate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AppContext);

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/messages", label: "Messages", icon: "💬" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
    { path: "/discover", label: "Discover", icon: "🔍" },
    { label: "Create", icon: "➕", isCreate: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const avatar = user
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "U")}&background=3B82F6&color=fff`
    : "";

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-white h-full flex flex-col">
      <div className="p-4 flex items-center justify-center border-b">
        <Link to="/">
          <img
            src="/connectly.svg"
            alt="Connectly"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {user && (
        <div className="p-4 flex items-center gap-3 border-b">
          <img
            src={avatar}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      )}

      <ul className="space-y-2 px-2 py-4 flex-1">
        {navItems.map((item) => (
          <li key={item.label}>
            {item.isCreate ? (
              <button
                type="button"
                onClick={() => typeof onOpenCreate === "function" && onOpenCreate()}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                to={item.path}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg ${
                  (item.path === "/" ? location.pathname === "/" : location.pathname === item.path || (item.path === "/profile" && location.pathname.startsWith("/profile")))
                    ? "bg-gray-200 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="p-2 border-t">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-medium"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
