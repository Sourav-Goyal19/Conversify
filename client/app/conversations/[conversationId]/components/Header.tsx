"use client";

import Avatar from "@/components/Avatar";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import ImageOpener from "@/components/ImageOpener";
import AvatarGroup from "@/components/AvatarGroup";
import { HiPhone, HiVideoCamera } from "react-icons/hi";
import CallModal from "./call-modal";
import IncomingCallModal from "./incoming-call-modal";
import OutgoingCallModal from "./outgoing-call-modal";

interface HeaderProps {
  conversation: any;
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const user = useAppSelector((state) => state.user.user);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isIncomingCallModalOpen, setIsIncomingCallModalOpen] = useState(false);
  const [isOutgoingCallModalOpen, setIsOutgoingCallModalOpen] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const otherUser = useMemo(() => {
    if (conversation.isGroup) {
      return;
    }
    return conversation.userIds.find((u: any) => u?._id !== user?._id);
  }, [conversation, user]);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation?.userIds?.length} members`;
    }
    return "Active";
  }, [conversation]);

  const handleCallInitiation = (video: boolean) => {
    setIsVideoCall(video);
    setIsOutgoingCallModalOpen(true);
    setTimeout(() => {
      setIsOutgoingCallModalOpen(false);
      setIsIncomingCallModalOpen(true);
    }, 10000);
  };

  const handleCallAccept = () => {
    setIsIncomingCallModalOpen(false);
    setIsCallModalOpen(true);
  };

  const handleCallDecline = () => {
    setIsIncomingCallModalOpen(false);
  };

  const handleCallCancel = () => {
    setIsOutgoingCallModalOpen(false);
  };

  return (
    <>
      <ProfileDrawer
        conversation={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <ImageOpener
        image={otherUser?.image}
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      />
      <IncomingCallModal
        isOpen={isIncomingCallModalOpen}
        onAccept={handleCallAccept}
        onDecline={handleCallDecline}
        caller={{
          name: otherUser?.name || "Unknown",
          avatar: otherUser?.image || "/images/user-avatar.jpeg",
        }}
        isVideoCall={isVideoCall}
      />
      <OutgoingCallModal
        isOpen={isOutgoingCallModalOpen}
        onCancel={handleCallCancel}
        recipient={{
          name: otherUser?.name || "Unknown",
          avatar: otherUser?.image || "/images/user-avatar.jpeg",
        }}
        isVideoCall={isVideoCall}
      />
      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        participant={{
          name: `${conversation?.name || otherUser?.name}`,
          avatar: `${otherUser?.image || "/images/user-avatar.jpeg"}`,
        }}
      />
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm dark:bg-primary dark:border-b-[1px] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer dark:text-accent-4"
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation?.isGroup ? (
            <AvatarGroup users={conversation?.userIds} />
          ) : (
            <Avatar image={otherUser?.image} />
          )}
          <div
            onClick={() => setIsImageOpen(true)}
            className="flex flex-col cursor-default"
          >
            <div className="dark:text-accent-3">
              {conversation?.name || otherUser?.name}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6">
          <HiPhone
            size={22}
            onClick={() => handleCallInitiation(false)}
            className="text-sky-500 cursor-pointer hover:text-sky-600 transition dark:text-accent-4 dark:hover:text-sky-600"
          />
          <HiVideoCamera
            size={26}
            onClick={() => handleCallInitiation(true)}
            className="text-sky-500 cursor-pointer hover:text-sky-600 transition dark:text-accent-4 dark:hover:text-sky-600"
          />
          <HiEllipsisHorizontal
            size={32}
            onClick={() => setDrawerOpen(true)}
            className="text-sky-500 cursor-pointer hover:text-sky-600 transition dark:text-accent-4 dark:hover:text-sky-600"
          />
        </div>
      </div>
    </>
  );
};

export default Header;
