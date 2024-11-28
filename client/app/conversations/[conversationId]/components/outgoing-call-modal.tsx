"use client";

import { useState, useEffect } from "react";
import { PhoneOff } from "lucide-react";

interface OutgoingCallModalProps {
  isOpen: boolean;
  onCancel: () => void;
  recipient: {
    name: string;
    avatar: string;
  };
  isVideoCall: boolean;
}

export default function OutgoingCallModal({
  isOpen,
  onCancel,
  recipient = {
    name: "Unknown",
    avatar: "/images/user-avatar.jpeg",
  },
  isVideoCall,
}: OutgoingCallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white dark:bg-[#031526] rounded-lg shadow-xl p-6 w-96 max-w-full animate-in fade-in duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500">
            <img
              src={recipient.avatar}
              alt={recipient.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-center dark:text-white">
            {recipient.name}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">
            {isVideoCall ? "Video" : "Voice"} Calling...
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={onCancel}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-300"
            aria-label="Cancel call"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
