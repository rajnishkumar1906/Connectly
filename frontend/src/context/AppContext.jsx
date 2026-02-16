import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useRef
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const AppContext = createContext(null);

/* ================= API ================= */
const RAW_API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TRIMMED = RAW_API.replace(/\/+$/, "");
const BASE_API = TRIMMED.endsWith("/api") ? TRIMMED.slice(0, -4) : TRIMMED;

const api = axios.create({
  baseURL: BASE_API,
  withCredentials: true
});

/* ========================================================= */

export const AppProvider = ({ children }) => {
  /* ================= AUTH STATE ================= */
  const [user, setUser] = useState(null);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [loading, setLoading] = useState(true);
  const socket = useRef(null);

  /* ================= PROFILE / SOCIAL ================= */
  const [profile, setProfile] = useState(null);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [friends, setFriends] = useState([]);

  /* ================= FEED ================= */
  const [feed, setFeed] = useState([]);

  /* ================= RECOMMENDATIONS ================= */
  const [recommendedUsers, setRecommendedUsers] = useState([]);

  /* ================= NOTIFICATIONS ================= */
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "dark"
      : "dark"
  );

  /* ================= SERVERS & CHANNELS ================= */
  const [myServers, setMyServers] = useState([]);
  const [currentServer, setCurrentServer] = useState(null);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [channelMessages, setChannelMessages] = useState([]);
  const [discoverServersList, setDiscoverServersList] = useState([]);

  /* ================= HELPERS ================= */
  const handleError = (err, fallback) => {
    if (err?.response?.status === 401) return;
    toast.error(err?.response?.data?.message || fallback);
  };

  const resetAuthState = () => {
    setUser(null);
    setIsAuthorised(false);
    setProfile(null);
    setFeed([]);
    setFollowersList([]);
    setFollowingList([]);
    setFriends([]);
    setRecommendedUsers([]);
    setNotifications([]);
    setUnreadCount(0);
    setMyServers([]);
    setCurrentServer(null);
    setChannels([]);
    setCurrentChannel(null);
    setChannelMessages([]);
    setDiscoverServersList([]);
  };

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (isAuthorised && !socket.current) {
      socket.current = io(BASE_API, {
        withCredentials: true,
        transports: ["polling", "websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socket.current.on("connect", () => {});
      socket.current.on("connect_error", () => {});
    }

    return () => {
      if (!isAuthorised && socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [isAuthorised]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/users/me");
        setUser(res.data.user);
        setIsAuthorised(true);
        await refreshAll();
      } catch {
        resetAuthState();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  /* ================= AUTH ================= */
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/api/users/login", { email, password });
      setUser(res.data.user);
      setIsAuthorised(true);
      toast.success("Login successful");
      await refreshAll();
    } catch (err) {
      handleError(err, "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    try {
      setLoading(true);
      const res = await api.post("/api/users/signup", data);
      setUser(res.data.user);
      setIsAuthorised(true);
      toast.success("Account created");
    } catch (err) {
      handleError(err, "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/users/logout");
    } catch (err) {
      handleError(err, "Logout failed");
    } finally {
      resetAuthState();
    }
  };

  /* ================= PROFILE ================= */
  const fetchOwnProfile = useCallback(async () => {
    try {
      const [profileRes, followersRes, followingRes] = await Promise.all([
        api.get("/api/users/retrieve-profile"),
        api.get("/api/users/followers"),
        api.get("/api/users/following")
      ]);

      setProfile(profileRes.data);
      setFollowersList(followersRes.data.followers || []);
      setFollowingList(followingRes.data.following || []);
    } catch (err) {
      handleError(err, "Failed to load profile");
      setProfile(null);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const res = await api.get(`/api/users/${userId}/profile`);
      return res.data;
    } catch (err) {
      handleError(err, "Failed to load user profile");
      return null;
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.patch("/api/users/update-profile", data, {
        headers: data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }
      });
      const updated = res.data.profile || res.data;
      setProfile(updated);
      toast.success("Profile updated");
      return true;
    } catch (err) {
      handleError(err, "Profile update failed");
      return false;
    }
  };

  /* ================= FOLLOW ================= */
  const followUser = async (userId) => {
    try {
      await api.post(`/api/users/follow/${userId}`);
      await refreshAll();
    } catch (err) {
      handleError(err, "Follow failed");
    }
  };

  const unfollowUser = async (userId) => {
    try {
      await api.delete(`/api/users/unfollow/${userId}`);
      await refreshAll();
    } catch (err) {
      handleError(err, "Unfollow failed");
    }
  };

  const checkFollow = async (userId) => {
    try {
      const res = await api.get(`/api/users/check-follow/${userId}`);
      return res.data.following;
    } catch (err) {
      handleError(err, "Failed to check follow");
      return false;
    }
  };

  const fetchUserFollowers = async (userId) => {
    try {
      const res = await api.get(`/api/users/followers/${userId}`);
      return res.data.followers || [];
    } catch (err) {
      handleError(err, "Failed to load followers");
      return [];
    }
  };

  const fetchUserFollowing = async (userId) => {
    try {
      const res = await api.get(`/api/users/following/${userId}`);
      return res.data.following || [];
    } catch (err) {
      handleError(err, "Failed to load following");
      return [];
    }
  };

  /* ================= FRIENDS ================= */
  const fetchFriends = useCallback(async () => {
    try {
      const res = await api.get("/api/friends");
      setFriends(res.data.friends || []);
    } catch (err) {
      handleError(err, "Failed to load friends");
      setFriends([]);
    }
  }, []);

  const fetchFeed = useCallback(async () => {
    if (!isAuthorised) return;
    try {
      const res = await api.get("/api/feed/feed");
      setFeed(res.data.posts || []);
    } catch (err) {
      handleError(err, "Failed to load feed");
      setFeed([]);
    }
  }, [isAuthorised]);

  const likePost = async (postId) => {
    try {
      const res = await api.post(`/api/feed/post/${postId}/like`);
      setFeed(prev =>
        prev.map(p =>
          p._id === postId
            ? { ...p, likeCount: res.data.likeCount, isLiked: res.data.liked }
            : p
        )
      );
    } catch (err) {
      handleError(err, "Like failed");
    }
  };

  const addComment = async (postId, text) => {
    try {
      const res = await api.post(`/api/feed/post/${postId}/comment`, { text });
      return res.data.comment;
    } catch (err) {
      handleError(err, "Comment failed");
      return null;
    }
  };

  const getComments = async (postId) => {
    try {
      const res = await api.get(`/api/feed/post/${postId}/comments`);
      return res.data.comments || [];
    } catch (err) {
      handleError(err, "Failed to load comments");
      return [];
    }
  };

  const fetchUserPosts = async (userId) => {
    try {
      const res = await api.get(`/api/feed/user/${userId}/posts`);
      return res.data.posts || [];
    } catch (err) {
      handleError(err, "Failed to load posts");
      return [];
    }
  };

  const createPost = async (formData) => {
    try {
      const res = await api.post("/api/feed/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFeed(prev => [res.data.post, ...prev]);
      toast.success("Post created");
      return { success: true };
    } catch (err) {
      handleError(err, "Post creation failed");
      return { success: false };
    }
  };

  const deletePost = async (postId) => {
    try {
      await api.delete(`/api/feed/post/${postId}`);
      setFeed(prev => prev.filter(p => p._id !== postId));
      toast.success("Post deleted");
    } catch (err) {
      handleError(err, "Delete failed");
    }
  };

  /* ================= RECOMMENDATIONS ================= */
  const fetchRecommendedUsers = useCallback(async () => {
    if (!isAuthorised) return;
    try {
      const res = await api.get("/api/users/recommended/list");
      setRecommendedUsers(res.data.users || []);
    } catch (err) {
      handleError(err, "Failed to load recommendations");
      setRecommendedUsers([]);
    }
  }, [isAuthorised]);

  /* ================= NOTIFICATIONS ================= */
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/api/notifications");
      const list = res.data.notifications || [];
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.isRead).length);
    } catch (err) {
      handleError(err, "Failed to load notifications");
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  const markNotificationRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (err) {
      handleError(err, "Failed to mark notification");
    }
  };

  /* ================= COMMUNITIES (servers) ================= */
  const fetchMyServers = useCallback(async () => {
    if (!isAuthorised) return;
    try {
      const res = await api.get("/api/servers");
      setMyServers(res.data.servers || []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setMyServers([]);
        return;
      }
      handleError(err, "Failed to load communities");
      setMyServers([]);
    }
  }, [isAuthorised]);

  const createServer = async (data) => {
    try {
      const res = await api.post("/api/servers", data);
      const server = res.data.server;
      setMyServers(prev => [server, ...prev]);
      toast.success("Community created");
      return { success: true, server };
    } catch (err) {
      handleError(err, "Failed to create community");
      return { success: false };
    }
  };

  const getServerByInviteCode = async (code) => {
    try {
      const res = await api.get(`/api/servers/invite/${code}`);
      return res.data.server;
    } catch (err) {
      handleError(err, "Invalid or expired invite");
      return null;
    }
  };

  const joinServerByInviteCode = async (code) => {
    try {
      const res = await api.post(`/api/servers/join/${code}`);
      const server = res.data.server;
      if (!res.data.alreadyMember) {
        setMyServers(prev => [server, ...prev]);
        toast.success("Joined community");
      }
      return { success: true, server };
    } catch (err) {
      handleError(err, "Failed to join community");
      return { success: false };
    }
  };

  const leaveServerById = async (serverId) => {
    try {
      await api.post(`/api/servers/${serverId}/leave`);
      setMyServers(prev => prev.filter(s => s._id !== serverId));
      if (currentServer?._id === serverId) {
        setCurrentServer(null);
        setChannels([]);
        setCurrentChannel(null);
        setChannelMessages([]);
      }
      toast.success("Left community");
    } catch (err) {
      handleError(err, "Failed to leave community");
    }
  };

  const updateServerById = async (serverId, data) => {
    try {
      const res = await api.patch(`/api/servers/${serverId}`, data);
      const updated = res.data.server;
      setMyServers(prev =>
        prev.map(s => (s._id === serverId ? { ...s, ...updated } : s))
      );
      if (currentServer?._id === serverId) setCurrentServer(prev => (prev ? { ...prev, ...updated } : null));
      toast.success("Community updated");
      return true;
    } catch (err) {
      handleError(err, "Failed to update community");
      return false;
    }
  };

  const fetchServerMembers = async (serverId) => {
    try {
      const res = await api.get(`/api/servers/${serverId}/members`);
      return res.data.members || [];
    } catch (err) {
      handleError(err, "Failed to load members");
      return [];
    }
  };

  const fetchDiscoverServers = async (category) => {
    try {
      const url = category ? `/api/servers/discover?category=${encodeURIComponent(category)}` : "/api/servers/discover";
      const res = await api.get(url);
      setDiscoverServersList(res.data.servers || []);
      return res.data.servers || [];
    } catch (err) {
      handleError(err, "Failed to discover servers");
      setDiscoverServersList([]);
      return [];
    }
  };

  /* ================= CHANNELS ================= */
  const fetchChannels = useCallback(async (serverId) => {
    if (!serverId) return;
    try {
      const res = await api.get(`/api/channels/server/${serverId}`);
      setChannels(res.data.channels || []);
      return res.data.channels || [];
    } catch (err) {
      handleError(err, "Failed to load channels");
      setChannels([]);
      return [];
    }
  }, []);

  const createChannel = async (serverId, data) => {
    try {
      const res = await api.post(`/api/channels/server/${serverId}`, data);
      const channel = res.data.channel;
      setChannels(prev => [...prev, channel]);
      toast.success("Channel created");
      return { success: true, channel };
    } catch (err) {
      handleError(err, "Failed to create channel");
      return { success: false };
    }
  };

  const fetchChannelMessages = useCallback(async (channelId, page = 1) => {
    if (!channelId) return;
    try {
      const res = await api.get(`/api/channels/${channelId}/messages?page=${page}&limit=50`);
      const list = res.data.messages || [];
      if (page === 1) setChannelMessages(list);
      else setChannelMessages(prev => [...list, ...prev]);
      return list;
    } catch (err) {
      handleError(err, "Failed to load messages");
      setChannelMessages([]);
      return [];
    }
  }, []);

  const sendChannelMessage = (channelId, text) => {
    if (!channelId || !text?.trim() || !user || !socket.current) return;
    const senderId = user._id ?? user.userId;
    if (!senderId) return;
    socket.current.emit("sendChannelMessage", {
      channelId,
      sender: senderId,
      text: text.trim(),
    });
  };

  const joinChannelRoom = (channelId) => {
    if (channelId && socket.current) socket.current.emit("joinChannel", channelId);
  };

  const leaveChannelRoom = (channelId) => {
    if (channelId && socket.current) socket.current.emit("leaveChannel", channelId);
  };

  const appendChannelMessage = (msg) => {
    setChannelMessages(prev => [...prev, msg]);
  };

  /* ================= GLOBAL REFRESH ================= */
  const refreshAll = async () => {
    await Promise.allSettled([
      fetchOwnProfile(),
      fetchFriends(),
      fetchRecommendedUsers(),
      fetchNotifications(),
      fetchMyServers()
    ]);
  };

  /* ================= CONTEXT ================= */
  return (
    <AppContext.Provider
      value={{
        api,
        user,
        isAuthorised,
        loading,
        socket,

        profile,
        followersList,
        followingList,
        friends,
        feed,
        recommendedUsers,

        notifications,
        unreadCount,
        theme,
        setTheme,

        myServers,
        currentServer,
        setCurrentServer,
        channels,
        currentChannel,
        setCurrentChannel,
        channelMessages,
        discoverServersList,
        setChannelMessages,

        login,
        signup,
        logout,

        fetchMyServers,
        createServer,
        getServerByInviteCode,
        joinServerByInviteCode,
        leaveServerById,
        updateServerById,
        fetchServerMembers,
        fetchDiscoverServers,

        fetchChannels,
        createChannel,
        fetchChannelMessages,
        sendChannelMessage,
        joinChannelRoom,
        leaveChannelRoom,
        appendChannelMessage,

        fetchFeed,
        likePost,
        addComment,
        getComments,
        createPost,
        deletePost,

        fetchOwnProfile,
        fetchUserProfile,
        fetchUserPosts,
        updateProfile,

        followUser,
        unfollowUser,
        checkFollow,
        fetchUserFollowers,
        fetchUserFollowing,

        fetchRecommendedUsers,
        fetchNotifications,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};