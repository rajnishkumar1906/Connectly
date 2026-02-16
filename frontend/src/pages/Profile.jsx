import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import PostItem from "../components/PostItem";
import PostModal from "../components/PostModal";
import {
  Camera,
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Loader2,
  ChevronLeft,
  Users,
  Image as ImageIcon
} from "lucide-react";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const context = useContext(AppContext);
  
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
  } = context;

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
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const imageUrl = (url) => {
    if (!url) return null;
    return url?.startsWith("http") ? url : url ? `${API_URL}${url}` : null;
  };

  useEffect(() => {
    if (!isAuthorised || !profileUserId) return;

    const load = async () => {
      setLoading(true);
      try {
        const profileRes = await fetchUserProfile(profileUserId);
        const followersRes = await fetchUserFollowers(profileUserId);
        const followingRes = await fetchUserFollowing(profileUserId);
        const postsRes = await fetchUserPosts(profileUserId);
        
        let followState = false;
        if (!isOwnProfile) {
          followState = await checkFollow(profileUserId);
        }

        setProfileUser(profileRes?.user || profileRes);
        setProfileData(profileRes?.profile || profileRes);
        setFollowers(followersRes || []);
        setFollowing(followingRes || []);
        setPosts(postsRes || []);
        setIsFollowing(Boolean(followState));
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [profileUserId, isAuthorised, isOwnProfile]);

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(profileUserId);
        setIsFollowing(false);
        setFollowers(prev => prev.filter(f => f._id !== user?._id));
      } else {
        await followUser(profileUserId);
        setIsFollowing(true);
        if (user) {
          setFollowers(prev => [...prev, user]);
        }
      }
    } catch (error) {
      console.error("Follow toggle error:", error);
    }
  };

  const openEdit = () => {
    const data = profileData || profileUser;
    setForm({
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      bio: data?.bio || "",
      city: data?.city || "",
      state: data?.state || "",
      website: data?.website || "",
      occupation: data?.occupation || "",
      education: data?.education || "",
      phoneNo: data?.phoneNo || ""
    });
    
    setAvatarPreview(imageUrl(data?.avatar));
    setCoverPreview(imageUrl(data?.coverImage));
    setIsEditing(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const saveProfile = async () => {
    setUploading(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });

    if (avatarFile) fd.append("avatar", avatarFile);
    if (coverFile) fd.append("coverImage", coverFile);

    const success = await updateProfile(fd);

    if (success) {
      const refreshed = await fetchUserProfile(profileUserId);
      setProfileUser(refreshed?.user || refreshed);
      setProfileData(refreshed?.profile || refreshed);

      setAvatarFile(null);
      setCoverFile(null);
      setAvatarPreview(null);
      setCoverPreview(null);
      setIsEditing(false);
    }

    setUploading(false);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleLike = async (postId) => {
    await likePost(postId);
    setPosts(prev => prev.map(p => 
      p._id === postId 
        ? { ...p, likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1, isLiked: !p.isLiked }
        : p
    ));
  };

  const handleUserClick = (clickedUserId) => {
    navigate(`/profile/${clickedUserId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center glass-card p-8 rounded-xl">
          <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4 text-gray-600 dark:text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayData = profileData || profileUser;
  const displayName = displayData?.firstName 
    ? `${displayData.firstName} ${displayData.lastName || ""}`.trim()
    : displayData?.username || "User";

  const coverImage = coverPreview || imageUrl(displayData?.coverImage);
  const avatarImage = avatarPreview || imageUrl(displayData?.avatar);

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-heavy px-4 py-3 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 glass-button rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-bold text-lg">{displayName}</h2>
      </div>

      {/* Cover Image */}
      <div className="relative h-48 glass-card rounded-none border-0">
        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-white/50" />
          </div>
        )}

        {isOwnProfile && (
          <div className="absolute bottom-4 right-4">
            <input
              id="coverInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
            <button
              onClick={() => document.getElementById("coverInput").click()}
              className="glass-button p-2 rounded-full"
            >
              <Camera size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 relative">
        <div className="flex justify-between items-end -mt-12 mb-4">
          <div className="relative">
            <div className="glass-avatar-ring rounded-full p-1">
              <Avatar
                src={avatarImage}
                fallback={displayName}
                className="w-24 h-24 rounded-full"
              />
            </div>
            
            {isOwnProfile && (
              <div className="absolute bottom-0 right-0">
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <button
                  onClick={() => document.getElementById("avatarInput").click()}
                  className="glass-button p-1.5 rounded-full"
                >
                  <Camera size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            )}
          </div>

          <div>
            {isOwnProfile ? (
              <Button onClick={openEdit} className="glass-button">
                Edit Profile
              </Button>
            ) : (
              <Button 
                onClick={toggleFollow} 
                className={isFollowing ? "glass-button" : "glass-gradient text-white"}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-gray-600 dark:text-gray-400">@{displayData?.username}</p>
          </div>

          {displayData?.bio && (
            <p className="text-gray-700 dark:text-gray-300 glass-card p-3 rounded-lg">
              {displayData.bio}
            </p>
          )}

          {/* Profile Meta */}
          <div className="flex flex-wrap gap-4 text-sm glass-card p-4 rounded-lg">
            {displayData?.city && (
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-gray-500" />
                {displayData.city}{displayData.state ? `, ${displayData.state}` : ""}
              </span>
            )}
            
            {displayData?.occupation && (
              <span className="flex items-center gap-1">
                <Briefcase size={16} className="text-gray-500" />
                {displayData.occupation}
              </span>
            )}
            
            {displayData?.education && (
              <span className="flex items-center gap-1">
                <GraduationCap size={16} className="text-gray-500" />
                {displayData.education}
              </span>
            )}
            
            {displayData?.website && (
              <span className="flex items-center gap-1">
                <LinkIcon size={16} className="text-gray-500" />
                <a 
                  href={displayData.website.startsWith('http') ? displayData.website : `https://${displayData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {displayData.website.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
          </div>

          {/* Follow Stats */}
          <div className="flex gap-4 text-sm glass-card p-3 rounded-lg">
            <button 
              onClick={() => setActiveTab("following")}
              className={`flex-1 text-center p-2 rounded-lg transition ${
                activeTab === "following" ? "glass-heavy" : "hover:glass"
              }`}
            >
              <span className="font-bold block">{following.length}</span>
              <span className="text-gray-600 dark:text-gray-400">Following</span>
            </button>
            <button 
              onClick={() => setActiveTab("followers")}
              className={`flex-1 text-center p-2 rounded-lg transition ${
                activeTab === "followers" ? "glass-heavy" : "hover:glass"
              }`}
            >
              <span className="font-bold block">{followers.length}</span>
              <span className="text-gray-600 dark:text-gray-400">Followers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mt-6 glass-card rounded-none border-x-0">
        {["posts", "followers", "following"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 font-medium capitalize transition-all
              ${activeTab === tab 
                ? "glass-heavy text-gray-900 dark:text-white" 
                : "glass-button text-gray-600 dark:text-gray-400"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "posts" && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-lg">
                <p className="text-gray-500">No posts yet</p>
              </div>
            ) : (
              posts.map(post => (
                <div 
                  key={post._id} 
                  onClick={() => handlePostClick(post)}
                  className="cursor-pointer glass-card rounded-lg overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <PostItem
                    post={{ ...post, user: profileUser }}
                    onLike={() => handleLike(post._id)}
                    onComment={(text) => addComment(post._id, text)}
                    getComments={() => getComments(post._id)}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "followers" && (
          <div className="space-y-2">
            {followers.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-lg">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-500">No followers yet</p>
              </div>
            ) : (
              followers.map(follower => (
                <div
                  key={follower._id}
                  onClick={() => handleUserClick(follower._id)}
                  className="flex items-center gap-3 p-3 glass-card rounded-lg cursor-pointer hover:glass-heavy transition"
                >
                  <Avatar
                    fallback={follower.username}
                    src={imageUrl(follower.avatar)}
                    size="md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {follower.firstName 
                        ? `${follower.firstName} ${follower.lastName || ""}`.trim()
                        : follower.username}
                    </h4>
                    <p className="text-sm text-gray-500">@{follower.username}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "following" && (
          <div className="space-y-2">
            {following.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-lg">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-500">Not following anyone yet</p>
              </div>
            ) : (
              following.map(followedUser => (
                <div
                  key={followedUser._id}
                  onClick={() => handleUserClick(followedUser._id)}
                  className="flex items-center gap-3 p-3 glass-card rounded-lg cursor-pointer hover:glass-heavy transition"
                >
                  <Avatar
                    fallback={followedUser.username}
                    src={imageUrl(followedUser.avatar)}
                    size="md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {followedUser.firstName 
                        ? `${followedUser.firstName} ${followedUser.lastName || ""}`.trim()
                        : followedUser.username}
                    </h4>
                    <p className="text-sm text-gray-500">@{followedUser.username}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-lg glass-panel rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 glass-heavy p-4 border-b border-white/20 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Profile</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-1 glass-button rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                    className="w-full p-2 glass-input rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => setForm({ ...form, lastName: e.target.value })}
                    className="w-full p-2 glass-input rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  rows="3"
                  className="w-full p-2 glass-input rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full p-2 glass-input rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    className="w-full p-2 glass-input rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={e => setForm({ ...form, website: e.target.value })}
                  className="w-full p-2 glass-input rounded-lg"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Occupation</label>
                <input
                  type="text"
                  value={form.occupation}
                  onChange={e => setForm({ ...form, occupation: e.target.value })}
                  className="w-full p-2 glass-input rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Education</label>
                <input
                  type="text"
                  value={form.education}
                  onChange={e => setForm({ ...form, education: e.target.value })}
                  className="w-full p-2 glass-input rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={form.phoneNo}
                  onChange={e => setForm({ ...form, phoneNo: e.target.value })}
                  className="w-full p-2 glass-input rounded-lg"
                />
              </div>
            </div>

            <div className="sticky bottom-0 glass-heavy p-4 border-t border-white/20 dark:border-white/5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="glass-button">
                Cancel
              </Button>
              <Button onClick={saveProfile} disabled={uploading} className="glass-gradient text-white">
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {isModalOpen && selectedPost && (
        <PostModal
          post={{ ...selectedPost, user: profileUser }}
          onClose={handleCloseModal}
          onLike={() => handleLike(selectedPost._id)}
          onComment={(text) => addComment(selectedPost._id, text)}
          getComments={() => getComments(selectedPost._id)}
        />
      )}
    </div>
  );
};

export default Profile;