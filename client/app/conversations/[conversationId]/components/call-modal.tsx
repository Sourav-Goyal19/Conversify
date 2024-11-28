"use client";

import clsx from "clsx";
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import { useEffect, useState, MouseEvent, useRef } from "react";

interface CallModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  participant?: {
    name: string;
    avatar?: string;
  };
}

export default function CallModal({
  isOpen = true,
  onClose = () => {},
  participant = {
    name: "No Name",
    avatar: "/images/user-avatar.jpeg",
  },
}: CallModalProps) {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: globalThis.MouseEvent) => {
        setPosition((prev) => ({
          x: prev.x + e.clientX - dragStart.x,
          y: prev.y + e.clientY - dragStart.y,
        }));
        setDragStart({ x: e.clientX, y: e.clientY });
      };
      const handleMouseUp = () => setIsDragging(false);

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        "fixed z-50 shadow-xl rounded-lg dark:border-white border-2 animate-blowup select-none"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="bg-gray-100/40 dark:bg-[#031526] border border-[#06192a] dark:border-[#06192a] rounded-lg p-4 w-64"
        onMouseDown={handleMouseDown}
      >
        <div className="space-y-4">
          <h2 className="text-center dark:text-white text-lg font-semibold cursor-move">
            Ongoing Call
          </h2>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={participant.avatar}
                alt={participant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold dark:text-white">
                {participant.name}
              </h3>
              <p className="text-sm text-gray-400">
                {formatDuration(duration)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          <button
            className={clsx(
              "h-10 w-10 rounded-full border-2 flex items-center justify-center hover:opacity-85",
              isMuted
                ? "bg-red-500/20 border-red-500 text-red-500"
                : "border-gray-500 text-gray-400"
            )}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
          <button
            className={clsx(
              "h-10 w-10 rounded-full border-2 flex items-center justify-center hover:opacity-85",
              isVideoOff
                ? "bg-red-500/20 border-red-500 text-red-500"
                : "border-gray-500 text-gray-400"
            )}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? (
              <VideoOff className="h-4 w-4" />
            ) : (
              <Video className="h-4 w-4" />
            )}
          </button>
          <button
            className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
            onClick={() => {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              setDuration(0);
              onClose();
            }}
          >
            <PhoneOff className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
