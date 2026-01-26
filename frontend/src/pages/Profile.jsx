import React, { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Rajnish",
    lastName: "Kumar",
    email: "rajnish.kumar@example.com",
    phone: "+91 8955694170",
    bio: "Software developer passionate about creating meaningful connections.",
    location: "Jalandhar, India",
    website: "https://rajnish-portfolio-alpha.vercel.app/",
  });

  // Profile posts (Instagram-style)
  const posts = [
    { id: 1, image: "https://picsum.photos/600/600?random=1" },
    { id: 2, image: "https://picsum.photos/600/600?random=2" },
    { id: 3, image: "https://picsum.photos/600/600?random=4" },
    { id: 4, image: "https://picsum.photos/600/600?random=5" },
    { id: 5, image: "https://picsum.photos/600/600?random=6" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Profile updated:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 no-scrollbar">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your public profile information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>

          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6 gap-6">

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 shadow-lg">
                  {formData.firstName[0]}
                  {formData.lastName[0]}
                </div>

                {/* Stats */}
                <div className="flex gap-6">
                  <Stat label="Posts" value={posts.length} />
                  <Stat label="Followers" value="170" />
                  <Stat label="Following" value="100" />
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gray-600">{formData.bio}</p>
              <p className="text-sm text-gray-500 mt-1">{formData.location}</p>
              <a
                href={formData.website}
                className="text-blue-600 text-sm"
                target="_blank"
                rel="noreferrer"
              >
                {formData.website}
              </a>
            </div>

            {isEditing && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                  <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                  <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
                  <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                  <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
                  <Input label="Website" name="website" value={formData.website} onChange={handleChange} />

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* POSTS SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Posts
          </h2>

          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square bg-gray-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-full object-cover hover:opacity-90 transition"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

/* Small reusable components */

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

export default Profile;
