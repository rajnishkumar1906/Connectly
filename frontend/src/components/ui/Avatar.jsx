import React from "react";

const Avatar = ({ src, fallback, size = "md", className = "" }) => {
  const [error, setError] = React.useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    full: "w-full h-full"
  };

  const getInitials = () => {
    if (!fallback) return "?";
    return fallback.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`
        ${sizeClasses[size] || sizeClasses.md}
        rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700
        flex items-center justify-center font-semibold
        ${className}
      `}
    >
      {src && !error ? (
        <img
          src={src}
          alt={fallback}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-gray-600 dark:text-gray-300">
          {getInitials()}
        </span>
      )}
    </div>
  );
};

export default Avatar;