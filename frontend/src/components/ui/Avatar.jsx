import React from "react";

const Avatar = ({ src, alt, fallback, size = "md", className = "" }) => {
  const sizes = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-20 w-20 text-xl",
    full: "h-full w-full",
  };

  const getFallbackUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "U"
    )}&background=3B82F6&color=fff&size=128`;
  };

  const imageSrc = src || getFallbackUrl(fallback);

  return (
    <div
      className={`relative inline-block rounded-full overflow-hidden bg-gray-100 border border-gray-200 ${sizes[size]} ${className}`}
    >
      <img
        src={imageSrc}
        alt={alt || fallback || "Avatar"}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = getFallbackUrl(fallback);
        }}
      />
    </div>
  );
};

export default Avatar;
