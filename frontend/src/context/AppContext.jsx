import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const AppContext = createContext(null);

const BASE_URL = "http://localhost:5000";

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feed, setFeed] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);

  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  /* ================= CHECK AUTH ON LOAD ================= */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/users/me");
        setUser(res.data.user);
        setIsAuthorised(true);
      } catch {
        setUser(null);
        setIsAuthorised(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/api/users/login", { email, password });
      setUser(res.data.user);
      setError(null);
      setIsAuthorised(true);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setIsAuthorised(false);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SIGNUP ================= */
  const signup = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/api/users/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setUser(res.data.user);
      setError(null);
      setIsAuthorised(true);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await api.post("/api/users/logout");
      setUser(null);
      setIsAuthorised(false);
      setFeed([]);
      setRecommendedUsers([]);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  /* ================= FEED ================= */
  const fetchFeed = useCallback(async () => {
    if (!isAuthorised) return;
    try {
      const res = await api.get("/api/feed/feed");
      setFeed(res.data.posts || []);
    } catch (err) {
      console.error("Fetch feed failed", err);
      setFeed([]);
    }
  }, [isAuthorised]);

  /* ================= CREATE POST ================= */
  const createPost = async (formData) => {
    try {
      const res = await api.post("/api/feed/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFeed((prev) => [res.data.post, ...prev]);
      return { success: true, post: res.data.post };
    } catch (err) {
      console.error("Create post failed", err);
      return { success: false, message: err.response?.data?.message || "Failed to create post" };
    }
  };

  /* ================= LIKE POST ================= */
  const likePost = async (postId) => {
    try {
      const res = await api.post(`/api/feed/post/${postId}/like`);
      setFeed((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                isLiked: res.data.liked,
                likeCount: res.data.likeCount,
              }
            : p
        )
      );
      return { liked: res.data.liked, likeCount: res.data.likeCount };
    } catch (err) {
      console.error("Like failed", err);
      return null;
    }
  };

  /* ================= ADD COMMENT ================= */
  const addComment = async (postId, text) => {
    try {
      const res = await api.post(`/api/feed/post/${postId}/comment`, { text });
      setFeed((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: [...(p.comments || []), res.data.comment],
                commentCount: res.data.commentCount,
              }
            : p
        )
      );
      return { success: true, comment: res.data.comment, commentCount: res.data.commentCount };
    } catch (err) {
      console.error("Comment failed", err);
      return { success: false };
    }
  };

  /* ================= RECOMMENDED USERS ================= */
  const fetchRecommendedUsers = useCallback(async () => {
    if (!isAuthorised) return;
    try {
      const res = await api.get("/api/users/recommended/list");
      setRecommendedUsers(res.data.users || []);
    } catch (err) {
      console.error("Fetch recommended failed", err);
      setRecommendedUsers([]);
    }
  }, [isAuthorised]);

  /* ================= FOLLOW / UNFOLLOW ================= */
  const followUser = async (userId) => {
    try {
      await api.post(`/api/users/follow/${userId}`);
      setRecommendedUsers((prev) => prev.filter((u) => u._id !== userId));
      await fetchFollowing();
      return true;
    } catch (err) {
      console.error("Follow failed", err);
      return false;
    }
  };

  const unfollowUser = async (userId) => {
    try {
      await api.delete(`/api/users/unfollow/${userId}`);
      await fetchFollowing();
      return true;
    } catch (err) {
      console.error("Unfollow failed", err);
      return false;
    }
  };

  /* ================= PROFILE ================= */
  const [profile, setProfile] = useState(null);
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);

  const fetchOwnProfile = useCallback(async () => {
    if (!isAuthorised) return null;
    try {
      const [profileRes, followingRes, followersRes] = await Promise.all([
        api.get("/api/users/retrieve-profile"),
        api.get("/api/users/following"),
        api.get("/api/users/followers"),
      ]);
      const profileData = profileRes.data;
      const following = followingRes.data.following || [];
      const followers = followersRes.data.followers || [];
      setProfile(profileData);
      setFollowingList(following);
      setFollowersList(followers);
      return { profile: profileData, following, followers };
    } catch (err) {
      console.error("Fetch profile failed", err);
      setProfile(null);
      setFollowingList([]);
      setFollowersList([]);
      return null;
    }
  }, [isAuthorised]);

  const updateProfile = async (data) => {
    try {
      const res = await api.patch("/api/users/update-profile", data);
      setProfile(res.data.profile);
      return { success: true, profile: res.data.profile };
    } catch (err) {
      console.error("Update profile failed", err);
      return { success: false, message: err.response?.data?.message };
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const res = await api.get(`/api/users/${userId}/profile`);
      return res.data;
    } catch (err) {
      console.error("Fetch user profile failed", err);
      return null;
    }
  };

  const fetchUserPosts = async (userId) => {
    try {
      const res = await api.get(`/api/feed/user/${userId}/posts`);
      return res.data.posts || [];
    } catch (err) {
      console.error("Fetch user posts failed", err);
      return [];
    }
  };

  const fetchFollowing = useCallback(async () => {
    if (!isAuthorised) return;
    try {
      const res = await api.get("/api/users/following");
      setFollowingList(res.data.following || []);
    } catch (err) {
      console.error("Fetch following failed", err);
    }
  }, [isAuthorised]);

  const checkFollow = async (userId) => {
    try {
      const res = await api.get(`/api/users/check-follow/${userId}`);
      return res.data.following;
    } catch {
      return false;
    }
  };

  const fetchUserFollowing = async (userId) => {
    try {
      const res = await api.get(`/api/users/following/${userId}`);
      return res.data.following || [];
    } catch {
      return [];
    }
  };

  const fetchUserFollowers = async (userId) => {
    try {
      const res = await api.get(`/api/users/followers/${userId}`);
      return res.data.followers || [];
    } catch {
      return [];
    }
  };

  const getComments = async (postId) => {
    try {
      const res = await api.get(`/api/feed/post/${postId}/comments`);
      return res.data.comments || [];
    } catch (err) {
      console.error("Get comments failed", err);
      return [];
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthorised,
        loading,
        error,
        feed,
        profile,
        followingList,
        followersList,
        recommendedUsers,
        login,
        signup,
        logout,
        fetchFeed,
        createPost,
        likePost,
        addComment,
        fetchRecommendedUsers,
        followUser,
        unfollowUser,
        fetchOwnProfile,
        updateProfile,
        fetchUserProfile,
        fetchUserPosts,
        fetchFollowing,
        checkFollow,
        getComments,
        fetchUserFollowing,
        fetchUserFollowers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
