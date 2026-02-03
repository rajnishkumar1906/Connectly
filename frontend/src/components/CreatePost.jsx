import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const CreatePost = ({ isOpen, onClose, onCreate }) => {
  const { createPost } = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Please select an image.");
      return;
    }
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    const result = await (onCreate || createPost)(formData);
    setUploading(false);
    if (result?.success) {
      setImage(null);
      setCaption("");
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      onClose?.();
    } else if (result?.message) {
      setError(result.message);
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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Create new post</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          {!preview ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-64 cursor-pointer hover:bg-gray-50 transition">
              <span className="text-4xl">🖼️</span>
              <p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(preview);
                  setImage(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
          )}

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption (optional)"
            rows={2}
            className="w-full border rounded-lg p-2 text-sm resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!image || uploading}
            className={`px-4 py-2 rounded-lg text-white ${
              image && !uploading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            {uploading ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
