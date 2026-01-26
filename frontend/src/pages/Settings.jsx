import React, { useState } from "react";
import { Link } from "react-router-dom";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    emailUpdates: false,
  });

  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    activityStatus: true,
    storySharing: true,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Settings saved:", { notifications, privacy });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile"
            className="text-2xl text-gray-600 hover:text-gray-900"
          >
            ←
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Notifications */}
          <Section title="Notifications">
            <Toggle
              label="Likes"
              description="Notify when someone likes your post"
              checked={notifications.likes}
              onChange={() => toggleNotification("likes")}
            />
            <Toggle
              label="Comments"
              description="Notify when someone comments"
              checked={notifications.comments}
              onChange={() => toggleNotification("comments")}
            />
            <Toggle
              label="New Followers"
              description="Notify when someone follows you"
              checked={notifications.follows}
              onChange={() => toggleNotification("follows")}
            />
            <Toggle
              label="Messages"
              description="Notify about new messages"
              checked={notifications.messages}
              onChange={() => toggleNotification("messages")}
            />
            <Toggle
              label="Email Updates"
              description="Receive weekly email summary"
              checked={notifications.emailUpdates}
              onChange={() => toggleNotification("emailUpdates")}
            />
          </Section>

          {/* Privacy & Security */}
          <Section title="Privacy & Security">
            <Toggle
              label="Private Account"
              description="Only approved followers can see your posts"
              checked={privacy.privateAccount}
              onChange={() => togglePrivacy("privateAccount")}
            />
            <Toggle
              label="Activity Status"
              description="Show when you're active"
              checked={privacy.activityStatus}
              onChange={() => togglePrivacy("activityStatus")}
            />
            <Toggle
              label="Story Sharing"
              description="Allow others to share your stories"
              checked={privacy.storySharing}
              onChange={() => togglePrivacy("storySharing")}
            />

            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-4"
            >
              Change Password
            </button>
          </Section>

          {/* Account Actions */}
          <Section title="Account Actions">
            <ActionButton
              title="Download Your Data"
              description="Request a copy of your information"
            />
            <ActionButton
              title="Temporarily Disable Account"
              description="Take a break from the platform"
            />
            <ActionButton
              title="Delete Account"
              description="Permanently delete your account"
              danger
            />
          </Section>

          {/* Save */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Changes
            </button>
            <Link
              to="/profile"
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};


const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div>
      <h3 className="font-medium text-gray-900">{label}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
    </label>
  </div>
);

const ActionButton = ({ title, description, danger }) => (
  <button
    type="button"
    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
      danger
        ? "text-red-600 hover:bg-red-50"
        : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    <div className="font-medium">{title}</div>
    <div className={`text-sm ${danger ? "text-red-500" : "text-gray-500"}`}>
      {description}
    </div>
  </button>
);

export default Settings;
