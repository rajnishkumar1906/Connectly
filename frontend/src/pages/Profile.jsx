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
  Mail,
  Globe,
  Settings,
  Edit3,
  MoreVertical,
  Link,
  Check,
  ChevronRight,
  MessageCircle,
  Shield,
  Heart,
  Bookmark,
  Share2,
  Loader2,
  Briefcase,
  GraduationCap,
  Hash,
  Sparkles
} from "lucide-react";

/* ================= TAB BUTTON ================= */
const TabButton = ({ active, onClick, icon: Icon, children, count }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 group ${
      active
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`}
  >
    <Icon className={`w-4 h-4 transition-transform ${active ? "scale-110" : ""}`} />
    <span>{children}</span>
    {count !== undefined && count > 0 && (
      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
        {count}
      </span>
    )}
  </button>
);

/* ================= USER CARD ================= */
const UserCard = ({ user, onClick, showFollowButton = false }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  
  return (
    <div 
      onClick={onClick}
      className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
    >
      <div className="flex items-center gap-3">
        <Avatar 
          fallback={user.username} 
          size="md"
          className="group-hover:ring-2 group-hover:ring-blue-100 transition-all"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{user.username}</h4>
          <p className="text-sm text-gray-500 truncate">{user.bio || "No bio yet"}</p>
        </div>
        {showFollowButton && (
          <Button
            variant={isFollowing ? "secondary" : "primary"}
            size="sm"
            className="rounded-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setIsFollowing(!isFollowing);
            }}
          >
            {isFollowing ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3 mr-1" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

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
  const [postLayout, setPostLayout] = useState("list");

  /* ================= EDIT PROFILE ================= */
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    city: "",
    state: "",
    bio: "",
    website: "",
    occupation: "",
    education: ""
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
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
      phoneNo: profileData?.phoneNo || "",
      city: profileData?.city || "",
      state: profileData?.state || "",
      bio: profileData?.bio || "",
      website: profileData?.website || "",
      occupation: profileData?.occupation || "",
      education: profileData?.education || ""
    });
    setIsEditing(true);
  };

  const saveProfile = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      
      // Add form fields
      Object.keys(form).forEach(key => {
        if (form[key]) formData.append(key, form[key]);
      });
      
      // Add files if changed
      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverFile) formData.append("cover", coverFile);
      
      const success = await updateProfile(formData);
      if (success) {
        const refreshed = await fetchUserProfile(profileUserId);
        setProfileData(refreshed.profile);
        setAvatarPreview(null);
        setCoverPreview(null);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
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
    <div className="max-w-6xl mx-auto pb-20">
      {/* COVER PHOTO */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden group">
        {coverPreview || profileData?.coverImage ? (
          <img 
            src={coverPreview || profileData.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {isOwnProfile && (
          <button
            onClick={() => document.getElementById("coverInput").click()}
            className="absolute bottom-4 right-4 bg-black/70 text-white p-3 rounded-full hover:bg-black hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
          >
            <Camera size={20} />
          </button>
        )}
        <input
          id="coverInput"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setCoverPreview(URL.createObjectURL(file));
              setCoverFile(file);
            }
          }}
        />
      </div>

      {/* PROFILE HEADER */}
      <div className="px-4 md:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative">
              <div className="relative">
                <Avatar
                  src={avatarPreview || profileData?.avatar}
                  fallback={displayName}
                  size="3xl"
                  className="border-6 border-white shadow-2xl ring-4 ring-white/50"
                />
                {isOwnProfile && (
                  <>
                    <button
                      onClick={() => document.getElementById("avatarInput").click()}
                      className="absolute bottom-3 right-3 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all shadow-lg"
                    >
                      <Camera size={18} />
                    </button>
                    <input
                      id="avatarInput"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setAvatarPreview(URL.createObjectURL(file));
                          setAvatarFile(file);
                        }
                      }}
                    />
                  </>
                )}
              </div>
              {isFollowing && !isOwnProfile && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                  <Check className="w-3 h-3 inline mr-1" />
                  Following
                </div>
              )}
            </div>

            <div className="md:mb-8">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {displayName}
                </h1>
                {profileData?.verified && (
                  <div className="bg-blue-500 text-white p-1 rounded-full" title="Verified">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <p className="text-gray-600 text-lg">@{profileUser?.username}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <button 
                  onClick={() => setActiveTab("followers")}
                  className="text-center hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <div className="text-2xl font-bold text-gray-900">{followers.length}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </button>
                <button 
                  onClick={() => setActiveTab("following")}
                  className="text-center hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <div className="text-2xl font-bold text-gray-900">{following.length}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-8">
            {isOwnProfile ? (
              <>
                <Button
                  variant="secondary"
                  onClick={openEdit}
                  className="rounded-xl gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-gray-100"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={toggleFollow}
                  className={`rounded-xl gap-2 ${isFollowing ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : ""}`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-xl gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-gray-100"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Bio & Details */}
        <div className="mt-6 space-y-4 max-w-3xl">
          {profileData?.bio && (
            <p className="text-gray-700 text-lg leading-relaxed">{profileData.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-gray-600">
            {profileData?.city && profileData?.state && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{profileData.city}, {profileData.state}</span>
              </div>
            )}
            {profileData?.occupation && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{profileData.occupation}</span>
              </div>
            )}
            {profileData?.education && (
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>{profileData.education}</span>
              </div>
            )}
            {profileData?.website && (
              <a 
                href={profileData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Link className="w-4 h-4" />
                <span>{profileData.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-8 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <TabButton 
              active={activeTab === "posts"} 
              onClick={() => setActiveTab("posts")}
              icon={Grid}
            >
              Posts
            </TabButton>
            <TabButton 
              active={activeTab === "followers"} 
              onClick={() => setActiveTab("followers")}
              icon={Users}
              count={followers.length}
            >
              Followers
            </TabButton>
            <TabButton 
              active={activeTab === "following"} 
              onClick={() => setActiveTab("following")}
              icon={UserPlus}
              count={following.length}
            >
              Following
            </TabButton>
            <TabButton 
              active={activeTab === "likes"} 
              onClick={() => setActiveTab("likes")}
              icon={Heart}
            >
              Likes
            </TabButton>
          </div>
          
          {activeTab === "posts" && posts.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-lg ${postLayout === "list" ? "bg-gray-100" : ""}`}
                onClick={() => setPostLayout("list")}
              >
                List
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-lg ${postLayout === "grid" ? "bg-gray-100" : ""}`}
                onClick={() => setPostLayout("grid")}
              >
                Grid
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        {activeTab === "posts" && (
          posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 mb-6">
                {isOwnProfile ? "Share your first post with the community!" : "This user hasn't posted anything yet."}
              </p>
              {isOwnProfile && (
                <Button
                  variant="primary"
                  className="rounded-xl"
                  onClick={() => navigate("/")}
                >
                  Create your first post
                </Button>
              )}
            </div>
          ) : postLayout === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <div 
                  key={post._id} 
                  className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt="Post" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                      <p className="text-gray-700 text-center line-clamp-6">{post.caption}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {posts.map(post => (
                <PostItem
                  key={post._id}
                  post={{ ...post, user: profileUser }}
                  onLike={likePost}
                  onComment={addComment}
                  getComments={getComments}
                />
              ))}
            </div>
          )
        )}

        {activeTab === "followers" && (
          <div className="space-y-3">
            {followers.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No followers yet
                </h3>
                <p className="text-gray-500">
                  {isOwnProfile ? "Start connecting with people to gain followers!" : "This user doesn't have any followers yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followers.map(user => (
                  <UserCard 
                    key={user._id} 
                    user={user} 
                    onClick={() => navigate(`/profile/${user._id}`)}
                    showFollowButton={!isOwnProfile}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "following" && (
          <div className="space-y-3">
            {following.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserPlus className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Not following anyone yet
                </h3>
                <p className="text-gray-500">
                  {isOwnProfile ? "Start following people to see their posts here!" : "This user isn't following anyone yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {following.map(user => (
                  <UserCard 
                    key={user._id} 
                    user={user} 
                    onClick={() => navigate(`/profile/${user._id}`)}
                    showFollowButton={!isOwnProfile}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-50 to-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Liked posts
            </h3>
            <p className="text-gray-500">
              {isOwnProfile ? "Posts you've liked will appear here." : "Liked posts will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md" onClick={() => setIsEditing(false)} />
          
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Edit Profile
                    </h2>
                    <p className="text-sm text-gray-500">Update your profile information</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full hover:bg-gray-100"
                >
                  <X size={22} />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "firstName", label: "First Name", placeholder: "Enter your first name" },
                  { key: "lastName", label: "Last Name", placeholder: "Enter your last name" },
                  { key: "city", label: "City", placeholder: "Enter your city", icon: MapPin },
                  { key: "state", label: "State", placeholder: "Enter your state" },
                  { key: "occupation", label: "Occupation", placeholder: "e.g., Software Engineer", icon: Briefcase },
                  { key: "education", label: "Education", placeholder: "e.g., University of...", icon: GraduationCap },
                  { key: "website", label: "Website", placeholder: "https://example.com", icon: Link },
                  { key: "phoneNo", label: "Phone Number", placeholder: "Enter your phone number", icon: Mail },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      {field.icon && (
                        <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      )}
                      <input
                        value={form[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${field.icon ? "pl-10" : ""}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell people about yourself..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
                <div className="text-right text-sm text-gray-500 mt-2">
                  {form.bio.length}/500
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="relative">
                    <Avatar
                      src={avatarPreview || profileData?.avatar}
                      fallback={displayName}
                      size="lg"
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => document.getElementById("modalAvatarInput").click()}
                    />
                    <input
                      id="modalAvatarInput"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setAvatarPreview(URL.createObjectURL(file));
                          setAvatarFile(file);
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Photo
                  </label>
                  <div 
                    className="relative h-32 rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => document.getElementById("modalCoverInput").click()}
                  >
                    {coverPreview || profileData?.coverImage ? (
                      <img 
                        src={coverPreview || profileData.coverImage} 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <input
                      id="modalCoverInput"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setCoverPreview(URL.createObjectURL(file));
                          setCoverFile(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl"
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveProfile}
                  className="rounded-xl gap-2"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;