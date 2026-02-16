import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Shield, Bell, UserCog, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import Switch from "./ui/Switch";
import Button from "./ui/Button";
import { AppContext } from "../context/AppContext";

const Settings = ({ onClose }) => {
  const navigate = useNavigate();
  const { theme, setTheme, user } = useContext(AppContext);
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

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notificationSettings');
    const savedPrivacy = localStorage.getItem('privacySettings');
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy));
    }
  }, []);

  const toggleNotification = (key) => {
    setNotifications((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const togglePrivacy = (key) => {
    setPrivacy((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      localStorage.setItem('privacySettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
    localStorage.setItem('privacySettings', JSON.stringify(privacy));
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out';
    toast.textContent = 'Settings saved successfully!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const SettingRow = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{label}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white dark:bg-black overflow-y-auto">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: theme === 'dark' 
            ? 'url(/bg.png)' 
            : 'url(/light.png)'
        }}
      />
      
      <div className="relative z-10 w-full pb-8 text-gray-900 dark:text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleClose}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Appearance Card */}
            <Card className="bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Appearance</CardTitle>
              </CardHeader>
              <CardContent>
                <SettingRow
                  label="Dark Mode"
                  description="Switch between light and dark themes for a comfortable viewing experience"
                >
                  <Switch
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                  />
                </SettingRow>
              </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card className="bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Bell size={20} />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200 dark:divide-gray-800">
                <SettingRow
                  label="Likes"
                  description="Get notified when someone likes your posts"
                >
                  <Switch
                    checked={notifications.likes}
                    onChange={() => toggleNotification("likes")}
                  />
                </SettingRow>
                
                <SettingRow
                  label="Comments"
                  description="Receive alerts when someone comments on your content"
                >
                  <Switch
                    checked={notifications.comments}
                    onChange={() => toggleNotification("comments")}
                  />
                </SettingRow>
                
                <SettingRow
                  label="New Followers"
                  description="Know when someone starts following you"
                >
                  <Switch
                    checked={notifications.follows}
                    onChange={() => toggleNotification("follows")}
                  />
                </SettingRow>
                
                <SettingRow
                  label="Direct Messages"
                  description="Get notified about new private messages"
                >
                  <Switch
                    checked={notifications.messages}
                    onChange={() => toggleNotification("messages")}
                  />
                </SettingRow>
                
                <SettingRow
                  label="Email Updates"
                  description="Receive weekly summaries of your activity"
                >
                  <Switch
                    checked={notifications.emailUpdates}
                    onChange={() => toggleNotification("emailUpdates")}
                  />
                </SettingRow>
              </CardContent>
            </Card>

            {/* Privacy Card */}
            <Card className="bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <Shield size={20} />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200 dark:divide-gray-800">
                <SettingRow
                  label="Private Account"
                  description="Only approved followers can see your posts and stories"
                >
                  <Switch
                    checked={privacy.privateAccount}
                    onChange={() => togglePrivacy("privateAccount")}
                  />
                </SettingRow>
                
                <SettingRow
                  label="Activity Status"
                  description="Show when you're active on Connectly"
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
                    className="w-full sm:w-auto border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions Card */}
            <Card className="bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <UserCog size={20} />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Download Your Data</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Request a copy of your information</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 dark:border-gray-700"
                  >
                    Request
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Temporarily Disable</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Take a break from Connectly</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                  >
                    Disable
                  </Button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="text-sm font-medium text-red-600 dark:text-red-500">Delete Account</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all data</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="px-8 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
              >
                Save Changes
              </Button>

              <Button 
                type="button"
                variant="secondary" 
                onClick={handleClose}
                className="px-8 border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;