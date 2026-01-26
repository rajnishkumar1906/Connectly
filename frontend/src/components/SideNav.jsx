import React from "react";
import { Link, useLocation } from "react-router-dom";

const SideNav = ({ onOpenCreate }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/messages", label: "Messages", icon: "💬" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
    { label: "Create", icon: "➕", isCreate: true },
  ];

  return (
    <aside className="w-64 border-r bg-white h-full">
      {/* <h1 className="text-xl font-bold p-4">MyApp</h1> */}
      <div className="p-4 flex items-center justify-center">
        <img
          src="/connectly.svg"
          alt="App Logo"
          className="h-15 w-auto object-contain"
        />
      </div>

      <ul className="space-y-2 px-2">
        {navItems.map((item) => (
          <li key={item.label}>
            {item.isCreate ? (
              <button
                onClick={onOpenCreate}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${location.pathname === item.path
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
    </aside>
  );
};

export default SideNav;
