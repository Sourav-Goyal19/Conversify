"use client";

import useConversation from "@/hooks/useConversation";
import React, { useEffect, useRef } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";

interface BodyProps {
  messages: object[];
}

const Body: React.FC<BodyProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();
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
        console.log("Seen Response", res);
      })
      .catch((err) => {
        console.log("Seen Error", err);
      });
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto dark:bg-secondary no-scrollbar">
      <div>
        {messages.map((message, i) => (
          <MessageBox
            isLast={i === messages.length - 1}
            key={i}
            data={message}
          />
        ))}
      </div>
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
