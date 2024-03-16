"use client";

import { format } from "date-fns";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { use, useCallback, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import Avatar from "@/components/Avatar";

interface ConversationBoxProps {
  data: any;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  console.log(data);
  const handleClick = useCallback(() => {
    router.push(`/conversations/${data._id}`);
  }, [router, data._id]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    console.log(messages[messages.length - 1]);
    return messages[messages.length - 1];
  }, [data.messages]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;
    const seenArray = lastMessage.seen || [];
    if (!user?._id) return false;
    return seenArray.includes(user?._id);
  }, [lastMessage, user?._id]);

  const userProfileImage = useMemo(() => {
    const image = data.userIds.map((userId: any) => {
      if (userId._id !== user?._id) {
        return userId.image;
      }
    });
    return image[0];
  }, []);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3 dark:bg-primary dark:hover:bg-tertiary",
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      <Avatar image={userProfileImage} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-base font-medium text-gray-900 dark:text-accent-3">
              {data.userIds.map((userId: any) =>
                userId?._id !== user?._id ? userId?.name : ""
              )}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              "truncate text-sm",
              hasSeen
                ? "text-gray-500 dark:text-gray-400"
                : "text-black dark:text-white font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
