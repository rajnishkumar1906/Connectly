import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import Button from "./ui/Button";
import Textarea from "./ui/Textarea";
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Smile, 
  MapPin, 
  Tag, 
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Users,
  Lock,
  Calendar,
  Palette
} from "lucide-react";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const CreatePost = ({ isOpen, onClose, onCreate }) => {
  const { createPost, user } = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [postType, setPostType] = useState("image");
  const [charCount, setCharCount] = useState(0);
  const [audience, setAudience] = useState("public");
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const MAX_CHARS = 2200;

  /* ================= DRAG & DROP HANDLERS ================= */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be under 5MB.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  /* ================= CHARACTER COUNT ================= */
  useEffect(() => {
    setCharCount(caption.length);
  }, [caption]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (postType === "image" && !image) {
      setError("Please select an image.");
      return;
    }

    if (postType === "text" && !caption.trim()) {
      setError("Please write something.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      if (postType === "image" && image) {
        formData.append("image", image);
      }
      formData.append("caption", caption);
      formData.append("audience", audience);

      const submitFn = typeof onCreate === "function" ? onCreate : createPost;
      const result = await submitFn(formData);

      if (result?.success) {
        if (preview) URL.revokeObjectURL(preview);
        setImage(null);
        setPreview(null);
        setCaption("");
        setAudience("public");
        onClose?.();
      } else if (result?.message) {
        setError(result.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ================= CLOSE ================= */
  const handleClose = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setCaption("");
    setError("");
    setAudience("public");
    onClose?.();
  };

  useEffect(() => {
    if (postType === "text" && preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
      setImage(null);
    }
  }, [postType, preview]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-100/80 bg-gradient-to-r from-white to-gray-50/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Create Post
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.username || "User"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAudienceMenu(!showAudienceMenu)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {audience === "public" && <Globe className="w-3 h-3" />}
                    {audience === "friends" && <Users className="w-3 h-3" />}
                    {audience === "private" && <Lock className="w-3 h-3" />}
                    <span className="capitalize">{audience}</span>
                    <span className="w-4 h-4">⌄</span>
                  </button>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full hover:bg-gray-100 active:scale-95 transition-all"
              aria-label="Close"
            >
              <X size={22} />
            </Button>
          </div>

          {/* Audience Menu Dropdown */}
          {showAudienceMenu && (
            <div className="absolute top-full left-6 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 animate-fade-in">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => { setAudience("public"); setShowAudienceMenu(false); }}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                    audience === "public" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-medium">Public</p>
                    <p className="text-xs text-gray-500">Anyone can see</p>
                  </div>
                </button>
                <button
                  onClick={() => { setAudience("friends"); setShowAudienceMenu(false); }}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                    audience === "friends" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-medium">Friends</p>
                    <p className="text-xs text-gray-500">Only your friends</p>
                  </div>
                </button>
                <button
                  onClick={() => { setAudience("private"); setShowAudienceMenu(false); }}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                    audience === "private" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-medium">Only Me</p>
                    <p className="text-xs text-gray-500">Private post</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Post Type Selector */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {[
            { id: "image", label: "Photo/Video", icon: ImageIcon },
            { id: "text", label: "Thought", icon: Sparkles },
            { id: "video", label: "Video", icon: Video, disabled: true },
            { id: "audio", label: "Audio", icon: Music, disabled: true }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => !type.disabled && setPostType(type.id)}
              disabled={type.disabled}
              className={`flex-1 flex flex-col items-center py-4 transition-all ${
                type.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-white/50"
              } ${postType === type.id 
                ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm" 
                : "text-gray-600"
              }`}
            >
              <type.icon className={`w-5 h-5 mb-1 ${postType === type.id ? "text-blue-600" : "text-gray-500"}`} />
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Image Upload Area */}
          {postType === "image" && (
            <div className={`transition-all duration-300 ${
              preview ? "max-h-[400px]" : "max-h-[300px]"
            }`}>
              {!preview ? (
                <div
                  className={`relative border-3 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center transition-all duration-300 ${
                    isDragging
                      ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    {isDragging && (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 rounded-2xl">
                        <div className="text-blue-600 font-medium">Drop image here</div>
                      </div>
                    )}
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {isDragging ? "Release to upload" : "Upload an image"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF up to 5MB</p>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Select from computer
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(preview);
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/80 text-white rounded-full flex items-center justify-center hover:bg-black hover:scale-110 active:scale-95 transition-all shadow-lg"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ready to post</span>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full hover:bg-white transition-all"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Post Type Visual */}
          {postType === "text" && (
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Share your thoughts</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Write something meaningful, share an idea, or start a discussion with your community.
              </p>
            </div>
          )}

          {/* Caption Input */}
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={
                  postType === "image"
                    ? "Write a compelling caption... Add hashtags, tag friends, or share your story."
                    : "What's on your mind? Share your thoughts, ideas, or questions..."
                }
                rows={postType === "image" ? 4 : 8}
                className="text-base resize-none border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl"
              />
              
              {/* Character Counter */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <div className={`text-xs font-medium ${
                  charCount > MAX_CHARS * 0.9 
                    ? "text-red-500" 
                    : "text-gray-500"
                }`}>
                  {charCount}/{MAX_CHARS}
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <Smile className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 p-3 bg-gray-50/50 rounded-xl">
              <span className="text-sm font-medium text-gray-600">Add to your post:</span>
              <div className="flex items-center gap-1">
                <button className="w-10 h-10 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <Tag className="w-5 h-5 text-blue-600" />
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-600" />
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                Posting as: <span className="font-semibold">{user?.username || "User"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="rounded-xl px-6 hover:bg-gray-200 transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={uploading || (postType === "image" && !image) || (postType === "text" && !caption.trim())}
                className={`rounded-xl px-8 font-medium transition-all ${
                  (postType === "image" && !image) || (postType === "text" && !caption.trim())
                    ? "opacity-50 cursor-not-allowed"
                    : "shadow-lg hover:shadow-xl active:scale-95"
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Share Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;