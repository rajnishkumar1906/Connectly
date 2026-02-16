import React from "react";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false,
  onClick,
  type = "button",
  ...props 
}) => {
  const baseClasses = "rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-black dark:bg-white dark:text-black dark:hover:bg-gray-200",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-400 dark:hover:bg-gray-800",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 focus:ring-purple-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    icon: "p-2"
  };

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;