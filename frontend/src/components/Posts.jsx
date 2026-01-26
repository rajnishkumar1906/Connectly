import React from "react";

const Posts = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No posts yet
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <div
          key={post.id}
          className="aspect-square overflow-hidden bg-gray-100 cursor-pointer"
        >
          <img
            src={post.image}
            alt="post"
            className="w-full h-full object-cover hover:opacity-90 transition"
          />
        </div>
      ))}
    </div>
  );
};

export default Posts;
