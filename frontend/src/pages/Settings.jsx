import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Shield, Bell, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Switch from "../components/ui/Switch";
import Button from "../components/ui/Button";

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
    // Here you would typically call an API to save settings
  };

  // Helper component for settings row
  const SettingRow = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full pb-8">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile"
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Settings
          </h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Bell size={20} />
              </div>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gray-100">
              <SettingRow
                label="Likes"
                description="Notify when someone likes your post"
              >
                <Switch
                  checked={notifications.likes}
                  onChange={() => toggleNotification("likes")}
                />
              </SettingRow>
              <SettingRow
                label="Comments"
                description="Notify when someone comments on your posts"
              >
                <Switch
                  checked={notifications.comments}
                  onChange={() => toggleNotification("comments")}
                />
              </SettingRow>
              <SettingRow
                label="New Followers"
                description="Notify when someone starts following you"
              >
                <Switch
                  checked={notifications.follows}
                  onChange={() => toggleNotification("follows")}
                />
              </SettingRow>
              <SettingRow
                label="Messages"
                description="Notify about new direct messages"
              >
                <Switch
                  checked={notifications.messages}
                  onChange={() => toggleNotification("messages")}
                />
              </SettingRow>
              <SettingRow
                label="Email Updates"
                description="Receive weekly digest of activity"
              >
                <Switch
                  checked={notifications.emailUpdates}
                  onChange={() => toggleNotification("emailUpdates")}
                />
              </SettingRow>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <Shield size={20} />
              </div>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gray-100">
              <SettingRow
                label="Private Account"
                description="Only approved followers can see your posts"
              >
                <Switch
                  checked={privacy.privateAccount}
                  onChange={() => togglePrivacy("privateAccount")}
                />
              </SettingRow>
              <SettingRow
                label="Activity Status"
                description="Show when you're active on the platform"
              >
                <Switch
                  checked={privacy.activityStatus}
                  onChange={() => togglePrivacy("activityStatus")}
                />
              </SettingRow>
              <SettingRow
                label="Story Sharing"
                description="Allow others to share your stories"
              >
                <Switch
                  checked={privacy.storySharing}
                  onChange={() => togglePrivacy("storySharing")}
                />
              </SettingRow>
              
              <div className="py-4">
                <Button 
                  variant="outline" 
                  onClick={() => console.log("Change password")}
                  className="w-full sm:w-auto"
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <UserCog size={20} />
              </div>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Download Your Data</h4>
                  <p className="text-sm text-gray-500">Request a copy of your information</p>
                </div>
                <Button variant="outline" size="sm">
                  Request
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Temporarily Disable</h4>
                  <p className="text-sm text-gray-500">Take a break from the platform</p>
                </div>
                <Button variant="outline" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200">
                  Disable
                </Button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-red-600">Delete Account</h4>
                  <p className="text-sm text-gray-500">Permanently delete your account</p>
                </div>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="gradient"
              className="px-8"
            >
              Save Changes
            </Button>

            <Link to="/profile">
              <Button variant="secondary" className="px-8">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
