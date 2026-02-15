import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import PostItem from "../components/PostItem";
import { 
  Grid, 
  Users, 
  UserPlus, 
  Camera, 
  X, 
  MapPin, 
  Calendar,
  Edit3,
  MessageCircle,
  Heart,
  Loader2,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  MoreVertical,
  Settings,
  Check
} from "lucide-react";

/* ================= PROFILE ================= */
const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    user,
    updateProfile,
    fetchUserProfile,
    fetchUserFollowers,
    fetchUserFollowing,
    fetchUserPosts,
    followUser,
    unfollowUser,
    checkFollow,
    likePost,
    addComment,
    getComments,
    isAuthorised
  } = useContext(AppContext);

  const profileUserId = userId || user?._id;
  const isOwnProfile = !userId || userId === user?._id;

  const [profileUser, setProfileUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);

  /* ================= EDIT PROFILE ================= */
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    city: "",
    state: "",
    website: "",
    occupation: "",
    education: "",
    phoneNo: ""
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!isAuthorised || !profileUserId) return;

    const load = async () => {
      setLoading(true);
      try {
        const [
          profileRes,
          followersRes,
          followingRes,
          postsRes,
          followState
        ] = await Promise.all([
          fetchUserProfile(profileUserId),
          fetchUserFollowers(profileUserId),
          fetchUserFollowing(profileUserId),
          fetchUserPosts(profileUserId),
          isOwnProfile ? false : checkFollow(profileUserId)
        ]);

        setProfileUser(profileRes?.user);
        setProfileData(profileRes?.profile);
        setFollowers(followersRes || []);
        setFollowing(followingRes || []);
        setPosts(postsRes || []);
        setIsFollowing(Boolean(followState));
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [profileUserId, isAuthorised]);

  /* ================= FOLLOW ================= */
  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(profileUserId);
        setIsFollowing(false);
      } else {
        await followUser(profileUserId);
        setIsFollowing(true);
      }

      setFollowers(await fetchUserFollowers(profileUserId));
      setFollowing(await fetchUserFollowing(profileUserId));
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  /* ================= EDIT PROFILE ================= */
  const openEdit = () => {
    setForm({
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      bio: profileData?.bio || "",
      city: profileData?.city || "",
      state: profileData?.state || "",
      website: profileData?.website || "",
      occupation: profileData?.occupation || "",
      education: profileData?.education || "",
      phoneNo: profileData?.phoneNo || ""
    });
    setIsEditing(true);
  };

  const saveProfile = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] != null && form[key] !== "") formData.append(key, form[key]);
      });
      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverFile) formData.append("cover", coverFile);

      const success = await updateProfile(formData);
      if (success) {
        const refreshed = await fetchUserProfile(profileUserId);
        if (refreshed?.profile) setProfileData(refreshed.profile);
        setAvatarFile(null);
        setCoverFile(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setUploading(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const imageUrl = (url) => (url?.startsWith("http") ? url : url ? `${API_URL}${url}` : null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const displayName =
    `${profileData?.firstName || ""} ${profileData?.lastName || ""}`.trim() ||
    profileUser?.username;

  const joinDate = profileUser?.createdAt 
    ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    : null;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="font-bold text-lg">{displayName}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{posts.length} posts</p>
          </div>
        </div>
      </div>

      {/* COVER PHOTO */}
      <div className="relative h-48 bg-gray-900 overflow-hidden">
        {(coverFile || profileData?.coverImage) && (
          <img
            src={coverFile ? URL.createObjectURL(coverFile) : imageUrl(profileData.coverImage) || profileData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {isOwnProfile && (
          <button
            onClick={() => document.getElementById("coverInput").click()}
            className="absolute bottom-4 right-4 bg-black/80 text-white p-2 rounded-full hover:bg-black"
          >
            <Camera size={16} />
          </button>
        )}
        <input id="coverInput" type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && setCoverFile(e.target.files[0])} />
      </div>

      {/* PROFILE HEADER */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div className="relative">
            <Avatar
              src={avatarFile ? URL.createObjectURL(avatarFile) : imageUrl(profileData?.avatar) || profileData?.avatar}
              fallback={displayName}
              size="3xl"
              className="border-4 border-black"
            />
            {isOwnProfile && (
              <>
                <button
                  onClick={() => document.getElementById("avatarInput").click()}
                  className="absolute bottom-2 right-2 bg-black/80 text-white p-2 rounded-full hover:bg-black"
                >
                  <Camera size={14} />
                </button>
                <input id="avatarInput" type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && setAvatarFile(e.target.files[0])} />
              </>
            )}
          </div>

          <div className="flex gap-2">
            {isOwnProfile ? (
              <>
                <Button
                  variant="secondary"
                  onClick={openEdit}
                  className="bg-transparent border border-gray-700 hover:bg-gray-900"
                >
                  Edit Profile
                </Button>
                <Button variant="ghost" size="icon" className="border border-gray-700">
                  <Settings size={18} />
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={toggleFollow}
                  className={isFollowing ? "bg-transparent border border-gray-700 hover:bg-gray-900" : ""}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="ghost" size="icon" className="border border-gray-700">
                  <MessageCircle size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="border border-gray-700">
                  <MoreVertical size={18} />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* NAME & USERNAME */}
        <div className="mb-4">
          <h1 className="text-xl font-bold">{displayName}</h1>
          <p className="text-gray-400">@{profileUser?.username}</p>
        </div>

        {/* BIO */}
        {profileData?.bio && (
          <p className="mb-4 text-white">{profileData.bio}</p>
        )}

        {/* DETAILS */}
        <div className="space-y-2 mb-4 text-gray-400 text-sm">
          {profileData?.city && profileData?.state && (
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>{profileData.city}, {profileData.state}</span>
            </div>
          )}
          {profileData?.occupation && (
            <div className="flex items-center gap-2">
              <Briefcase size={14} />
              <span>{profileData.occupation}</span>
            </div>
          )}
          {profileData?.website && (
            <a href={profileData.website.startsWith("http") ? profileData.website : `https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline">
              <LinkIcon size={14} />
              <span>{profileData.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {profileData?.phoneNo && (
            <div className="flex items-center gap-2">
              <span>{profileData.phoneNo}</span>
            </div>
          )}
          {profileData?.education && (
            <div className="flex items-center gap-2">
              <GraduationCap size={14} />
              <span>{profileData.education}</span>
            </div>
          )}
          {joinDate && (
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Joined {joinDate}</span>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="flex gap-6 mb-4">
          <button onClick={() => setActiveTab("following")} className="hover:underline">
            <span className="font-bold text-white">{following.length}</span>
            <span className="text-gray-400"> Following</span>
          </button>
          <button onClick={() => setActiveTab("followers")} className="hover:underline">
            <span className="font-bold text-white">{followers.length}</span>
            <span className="text-gray-400"> Followers</span>
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="border-b border-gray-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-4 font-medium text-sm ${activeTab === "posts" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("replies")}
            className={`flex-1 py-4 font-medium text-sm ${activeTab === "replies" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
          >
            Replies
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-4 font-medium text-sm ${activeTab === "media" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
          >
            Media
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`flex-1 py-4 font-medium text-sm ${activeTab === "likes" ? "text-black border-b-2 border-black dark:text-white dark:border-white" : "text-gray-500 dark:text-gray-400"}`}
          >
            Likes
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === "posts" && (
          posts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {isOwnProfile ? "No posts yet" : "No posts"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {isOwnProfile ? "When you post something, it will show up here." : "When they post, it will show up here."}
              </p>
              {isOwnProfile && (
                <Button
                  onClick={() => navigate("/")}
                  className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200"
                >
                  Create your first post
                </Button>
              )}
            </div>
          ) : (
            <div>
              {posts.map(post => (
                <div key={post._id} className="border-b border-gray-200 dark:border-gray-800">
                  <PostItem
                    post={{ ...post, user: profileUser }}
                    onLike={likePost}
                    onComment={addComment}
                    getComments={getComments}
                  />
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === "followers" && (
          <div className="p-4">
            {followers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">No followers yet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {isOwnProfile ? "When someone follows you, they'll show up here." : "No followers yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {followers.map(user => (
                  <div 
                    key={user._id}
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar fallback={user.username} src={user.avatar} size="md" />
                      <div>
                        <h4 className="font-medium">{user.username}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.bio || "No bio"}</p>
                      </div>
                    </div>
                    {!isOwnProfile && (
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200 text-xs">
                        Follow
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "following" && (
          <div className="p-4">
            {following.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Not following anyone</h3>
                <p className="text-gray-400">
                  {isOwnProfile ? "When you follow people, they'll show up here." : "Not following anyone yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {following.map(user => (
                  <div 
                    key={user._id}
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="flex items-center justify-between p-3 hover:bg-gray-900 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar fallback={user.username} src={user.avatar} size="md" />
                      <div>
                        <h4 className="font-medium text-white">{user.username}</h4>
                        <p className="text-sm text-gray-400">{user.bio || "No bio"}</p>
                      </div>
                    </div>
                    <Button size="sm" className="border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-xs">
                      Following
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "likes" && (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-600" />
            </div>
              <h3 className="text-xl font-bold mb-2">No likes yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
              {isOwnProfile ? "Posts you've liked will appear here." : "Liked posts will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold">Edit Profile</h2>
              <button onClick={() => !uploading && setIsEditing(false)} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {[
                { key: "firstName", label: "First Name" },
                { key: "lastName", label: "Last Name" },
                { key: "phoneNo", label: "Phone" },
                { key: "city", label: "City" },
                { key: "state", label: "State" },
                { key: "occupation", label: "Occupation" },
                { key: "education", label: "Education" },
                { key: "website", label: "Website" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.label}</label>
                  <input
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 resize-none"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files[0] && setAvatarFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Cover Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files[0] && setCoverFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                disabled={uploading}
                className="border border-gray-300 dark:border-gray-700 bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={saveProfile} disabled={uploading} className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200">
                {uploading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
