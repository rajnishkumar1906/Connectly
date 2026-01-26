import React, { useState } from "react";

const CreatePost = ({ isOpen, onClose, onCreate }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!image) return;

    onCreate({
      image,
      caption,
    });

    setImage(null);
    setPreview(null);
    setCaption("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Create new post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">

          {/* Image Upload */}
          {!preview ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-64 cursor-pointer hover:bg-gray-50 transition">
              <span className="text-4xl">🖼️</span>
              <p className="mt-2 text-sm text-gray-600">
                Click to upload an image
              </p>
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
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Optional Caption (can remove if you want ZERO text) */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption (optional)"
            rows={2}
            className="w-full border rounded-lg p-2 text-sm resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!image}
            className={`px-4 py-2 rounded-lg text-white ${
              image
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Share
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePost;
