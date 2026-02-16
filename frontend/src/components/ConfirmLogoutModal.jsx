import React from "react";
import Button from "./ui/Button";

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-sm p-6 z-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Log out?
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to log out of your account?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;