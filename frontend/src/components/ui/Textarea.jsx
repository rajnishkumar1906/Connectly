import React from "react";

const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`
        w-full px-3 py-2
        bg-white dark:bg-gray-800
        border border-gray-300 dark:border-gray-700
        rounded-lg
        text-gray-900 dark:text-white
        placeholder-gray-500 dark:placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
        transition
        resize-none
        ${className}
      `}
      {...props}
    />
  );
};

export default Textarea;