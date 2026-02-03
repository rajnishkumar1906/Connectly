import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Stat = ({ label, value }) => (
  <div className="text-center">
    <p className="font-semibold">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input {...props} className="w-full px-4 py-2 border rounded-lg" />
  </div>
);

const Profile = () => {
  const { userId } = useParams();
  const {
    user: currentUser,
    profile: ownProfile,
    followingList,
    followersList,
    fetchOwnProfile,
    fetchUserProfile,
    fetchUserPosts,
    updateProfile,
    followUser,
    unfollowUser,
    checkFollow,
    fetchUserFollowing,
    fetchUserFollowers,
    isAuthorised,
  } = useContext(AppContext);

  const isOwnProfile = !userId || (currentUser && currentUser._id === userId);
  const profileUserId = userId || currentUser?._id;

  const [viewUser, setViewUser] = useState(null);
  const [viewProfile, setViewProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [otherFollowingCount, setOtherFollowingCount] = useState(0);
  const [otherFollowersCount, setOtherFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    city: "",
    state: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthorised) {
      setLoading(false);
      return;
    }
    if (isOwnProfile && !currentUser) return;
    if (!isOwnProfile && !userId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      if (isOwnProfile) {
        const result = await fetchOwnProfile();
        const postList = await fetchUserPosts(profileUserId);
        setPosts(postList);
        setViewUser(currentUser);
        const p = result?.profile ?? ownProfile;
        setViewProfile(p);
        setFormData({
          firstName: p?.firstName ?? "",
          lastName: p?.lastName ?? "",
          phoneNo: p?.phoneNo ?? "",
          city: p?.city ?? "",
          state: p?.state ?? "",
          bio: p?.bio ?? "",
        });
      } else {
        const data = await fetchUserProfile(profileUserId);
        if (data) {
          setViewUser(data.user);
          setViewProfile(data.profile);
          setFormData({
            firstName: data.profile?.firstName ?? "",
            lastName: data.profile?.lastName ?? "",
            phoneNo: data.profile?.phoneNo ?? "",
            city: data.profile?.city ?? "",
            state: data.profile?.state ?? "",
            bio: data.profile?.bio ?? "",
          });
        }
        const postList = await fetchUserPosts(profileUserId);
        setPosts(postList);
        const following = await checkFollow(profileUserId);
        setIsFollowing(following);
        const [followingListRes, followersListRes] = await Promise.all([
          fetchUserFollowing(profileUserId),
          fetchUserFollowers(profileUserId),
        ]);
        setOtherFollowingCount(followingListRes.length);
        setOtherFollowersCount(followersListRes.length);
      }
      setLoading(false);
    };
    load();
  }, [isAuthorised, profileUserId, isOwnProfile, currentUser?._id, userId]);

  useEffect(() => {
    if (isOwnProfile && ownProfile) {
      setViewProfile(ownProfile);
      setFormData({
        firstName: ownProfile.firstName ?? "",
        lastName: ownProfile.lastName ?? "",
        phoneNo: ownProfile.phoneNo ?? "",
        city: ownProfile.city ?? "",
        state: ownProfile.state ?? "",
        bio: ownProfile.bio ?? "",
      });
    }
    if (isOwnProfile) setViewUser(currentUser);
  }, [isOwnProfile, ownProfile, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(formData);
    setIsEditing(false);
    setSaving(false);
  };

  const handleFollowToggle = async () => {
    if (!profileUserId || isOwnProfile) return;
    if (isFollowing) {
      await unfollowUser(profileUserId);
      setIsFollowing(false);
    } else {
      await followUser(profileUserId);
      setIsFollowing(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const displayName = viewProfile
    ? `${viewProfile.firstName || ""} ${viewProfile.lastName || ""}`.trim() || viewUser?.username
    : viewUser?.username ?? "User";
  const avatar = viewUser
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "U")}&background=3B82F6&color=fff`
    : "";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            {isOwnProfile ? "Manage your public profile" : "Viewing profile"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6 gap-6">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 shadow-lg overflow-hidden">
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-6">
                  <Stat label="Posts" value={posts.length} />
                  <Stat label="Followers" value={isOwnProfile ? followersList.length : otherFollowersCount} />
                  <Stat label="Following" value={isOwnProfile ? followingList.length : otherFollowingCount} />
                </div>
              </div>
              {isOwnProfile ? (
                !isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    isFollowing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold">{displayName}</h2>
              <p className="text-gray-600">@{viewUser?.username}</p>
              {viewProfile?.bio && <p className="text-gray-600 mt-2">{viewProfile.bio}</p>}
              {viewProfile?.city && (
                <p className="text-sm text-gray-500 mt-1">
                  {[viewProfile.city, viewProfile.state].filter(Boolean).join(", ")}
                </p>
              )}
            </div>

            {isOwnProfile && isEditing && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Phone"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                  />
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to="/"
                  className="aspect-square bg-gray-100 overflow-hidden cursor-pointer block"
                >
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="w-full h-full object-cover hover:opacity-90 transition"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {isOwnProfile && (followingList.length > 0 || followersList.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Following</h2>
              <ul className="space-y-2">
                {followingList.map((u) => (
                  <li key={u._id}>
                    <Link
                      to={`/profile/${u._id}`}
                      className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2"
                    >
                      <img
                        src={u.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium">{u.username}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Followers</h2>
              <ul className="space-y-2">
                {followersList.map((u) => (
                  <li key={u._id}>
                    <Link
                      to={`/profile/${u._id}`}
                      className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2"
                    >
                      <img
                        src={u.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium">{u.username}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
