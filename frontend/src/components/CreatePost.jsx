import React, { useState, useContext, useRef } from "react";
import { AppContext } from "../context/AppContext";
import Button from "./ui/Button";
import Textarea from "./ui/Textarea";
import {
  X,
  Image as ImageIcon,
  Globe,
  Users,
  Lock,
  Smile,
  Loader2
} from "lucide-react";

const CreatePost = ({ isOpen, onClose, onCreate }) => {
  const { createPost, user } = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [audience, setAudience] = useState("public");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async () => {
    if (!image && !caption.trim()) {
      setError("Please add an image or write something");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      if (image) {
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
        onClose?.();
      } else if (result?.message) {
        setError(result.message);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setCaption("");
    setError("");
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-lg glass-panel rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 glass-divider">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Post</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="glass-button"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Audience Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setAudience("public")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition ${
                audience === "public"
                ? "glass-heavy text-black dark:text-white"
                : "glass-button text-gray-600 dark:text-gray-400"
              }`}
            >
              <Globe size={14} />
              Public
            </button>
            <button
              onClick={() => setAudience("friends")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition ${
                audience === "friends"
                ? "glass-heavy text-black dark:text-white"
                : "glass-button text-gray-600 dark:text-gray-400"
              }`}
            >
              <Users size={14} />
              Friends
            </button>
            <button
              onClick={() => setAudience("private")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition ${
                audience === "private"
                ? "glass-heavy text-black dark:text-white"
                : "glass-button text-gray-600 dark:text-gray-400"
              }`}
            >
              <Lock size={14} />
              Only Me
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm p-2 glass rounded">
              {error}
            </div>
          )}

          {/* Image Upload */}
          {!preview ? (
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer glass-card"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Click to upload image</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative image-preview">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  URL.revokeObjectURL(preview);
                  setImage(null);
                  setPreview(null);
                }}
                className="image-preview-remove"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Caption */}
          <div className="relative">
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening?"
              rows={4}
              className="glass-input resize-none"
            />

            <div className="absolute bottom-2 right-2">
              <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition glass-button rounded-full">
                <Smile size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 glass-divider flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="glass-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={uploading || (!image && !caption.trim())}
            className="glass-gradient text-white"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;