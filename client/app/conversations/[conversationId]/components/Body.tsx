"use client";

import useConversation from "@/hooks/useConversation";
import React, { useContext, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";
import { RxCross2 } from "react-icons/rx";
import { useReplyContext } from "./ReplyMessageContext";

interface BodyProps {
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

const Body: React.FC<BodyProps> = ({ messages, setMessages }) => {
  // console.log(messages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();
  const { replyMessage, setReplyMessage } = useReplyContext();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversations/${conversationId}/seen`,
        {
          currentUserId: user?._id,
        }
      )
      .then((res) => {
        // console.log("Seen Response", res);
      })
      .catch((err) => {
        console.log("Seen Error", err);
      });

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    pusherClient.subscribe(conversationId);

    const messageHandler = (message: any) => {
      axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversations/${conversationId}/seen`,
        {
          currentUserId: user?._id,
        }
      );
      // console.log(message);
      setMessages((current: any) => {
        if (find(current, { _id: message?._id })) {
          return current;
        }
        return [...current, message];
      });
    };

    const updateMessageHandler = (message: any) => {
      setMessages((current: any) =>
        current.map((cm: any) => {
          if (cm._id == message._id) {
            return message;
          }
          return cm;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  window.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
      setReplyMessage(null);
    }
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, setMessages]);

  return (
    <div className="flex-1 overflow-y-auto dark:bg-secondary no-scrollbar">
      <div>
        {messages.map((message: any, i: any) => (
          <MessageBox
            isLast={i === messages.length - 1}
            key={i}
            data={message}
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
          />
        ))}
      </div>
      {replyMessage && (
        <div className="sticky bottom-0 flex border-t border-gray-300 bg-white dark:border-slate-800">
          <div className="flex-1 flex bg-neutral-100 h-11 overflow-hidden dark:bg-tertiary dark:text-accent-1">
            <div className="h-full w-1 bg-blue-400 rounded-xl"></div>
            <div className="pl-3 p-1 h-full w-full overflow-hidden select-none whitespace-nowrap flex items-center text-ellipsis">
              {replyMessage.body}
            </div>
          </div>
          <div className="p-2 dark:bg-secondary dark:text-accent-3">
            <RxCross2
              size={26}
              onClick={() => setReplyMessage(null)}
              cursor={"pointer"}
            />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default Body;
