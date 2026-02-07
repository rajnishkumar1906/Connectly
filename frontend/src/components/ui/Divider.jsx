import React from "react";

const Divider = ({ label, className = "" }) => {
  if (!label) {
    return <div className={`border-t border-gray-200 my-4 ${className}`} />;
  }

  return (
    <div className={`relative my-6 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-gray-500">{label}</span>
      </div>
    </div>
  );
};

export default Divider;
