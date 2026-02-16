import React, { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import Avatar from "../components/ui/Avatar";
import { Bell, UserPlus, Heart, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

const formatTime = (date) => {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  
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

  const unreadNotifications = (notifications || []).filter(n => !n.isRead);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "follow":
        return <UserPlus className="w-5 h-5 text-white" />;
      case "like":
        return <Heart className="w-5 h-5 text-white" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-white" />;
      default:
        return <Users className="w-5 h-5 text-white" />;
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case "follow":
        return "followed you";
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "mention":
        return "mentioned you";
      default:
        return "interacted with you";
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <span className="font-bold dark:text-black text-white">C</span>
            </div>
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {unreadNotifications.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-800">
              <Bell className="w-8 h-8 text-gray-500 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">No unread notifications</h3>
            <p className="text-gray-500 dark:text-gray-400">You're all caught up. New notifications will appear here.</p>
          </div>
        ) : (
          <div>
            {unreadNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => markNotificationRead(notification._id)}
                className={`flex items-start gap-3 p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 ${
                  !notification.isRead ? "bg-gray-100 dark:bg-gray-900/50" : ""
                }`}
              >
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1 flex-wrap">
                      <Link 
                        to={`/profile/${notification.sender?._id}`}
                        className="font-bold hover:underline"
                      >
                        {notification.sender?.username}
                      </Link>
                      <span className="text-gray-500 dark:text-gray-400">
                        {getNotificationMessage(notification)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>

                  {notification.post?.caption && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                      {notification.post.caption}
                    </p>
                  )}
                </div>

                {!notification.isRead && (
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;