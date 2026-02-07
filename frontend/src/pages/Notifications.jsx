import React, { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import Avatar from "../components/ui/Avatar";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

const formatTime = (date) => {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(date).toLocaleDateString();
};

const Notifications = () => {
  const {
    notifications,
    fetchNotifications,
    markNotificationRead,
    isAuthorised
  } = useContext(AppContext);

  useEffect(() => {
    if (isAuthorised) fetchNotifications();
  }, [isAuthorised, fetchNotifications]);

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Bell size={48} />
        <p className="mt-3 text-sm">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Notifications</h1>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => {
              if (!n.isRead) markNotificationRead(n._id);
            }}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition ${
              n.isRead
                ? "bg-white border-gray-200"
                : "bg-blue-50 border-blue-200 hover:bg-blue-100"
            }`}
          >
            <Link to={`/profile/${n.sender?._id}`}>
              <Avatar
                src={n.sender?.avatar}
                fallback={n.sender?.username}
                size="md"
              />
            </Link>

            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">
                  {n.sender?.username}
                </span>{" "}
                {n.type === "follow" && "started following you"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {formatTime(n.createdAt)}
              </p>
            </div>

            {!n.isRead && (
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
