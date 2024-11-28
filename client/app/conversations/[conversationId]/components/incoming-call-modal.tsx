"use client";

import { useState, useEffect } from "react";
import { Phone, PhoneOff, Video } from "lucide-react";
import clsx from "clsx";

interface IncomingCallModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  caller: {
    name: string;
    avatar: string;
  };
  isVideoCall: boolean;
}

export default function IncomingCallModal({
  isOpen,
  onAccept,
  onDecline,
  caller = {
    name: "Unknown",
    avatar: "/public/images/user-avatar.jpeg",
  },
  isVideoCall,
}: IncomingCallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 dark:border-white border-2">
      <div className="bg-white dark:bg-[#031526] rounded-lg shadow-xl p-6 w-96 max-w-full animate-in fade-in duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500">
            <img
              src={caller.avatar}
              alt={caller.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-center dark:text-white">
            {caller.name}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">
            Incoming {isVideoCall ? "Video" : "Voice"} Call
          </p>
        </div>
        <div className="flex justify-center space-x-6 mt-8">
          <button
            onClick={onDecline}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-colors animate-bounce duration-300"
            aria-label="Decline call"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={onAccept}
            className={clsx(
              "flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-300 animate-bounce",
              isVideoCall
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-green-500 hover:bg-green-600"
            )}
            aria-label="Accept call"
          >
            {isVideoCall ? (
              <Video className="w-8 h-8 text-white" />
            ) : (
              <Phone className="w-8 h-8 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
