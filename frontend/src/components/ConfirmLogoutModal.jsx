import React from "react";
import Button from "./ui/Button";

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 z-10 transform transition-all scale-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Log out?
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to log out of your account?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            variant="danger"
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
