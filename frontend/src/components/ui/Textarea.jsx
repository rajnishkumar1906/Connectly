import React from "react";

const Textarea = React.forwardRef(({ className = "", error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        className={`flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm resize-none ${
          error ? "border-red-500 focus:ring-red-500" : ""
        } ${className}`}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
