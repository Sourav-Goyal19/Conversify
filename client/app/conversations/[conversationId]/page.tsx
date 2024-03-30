"use client";

import EmptyStack from "@/components/EmptyStack";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
  conversationId: string;
}

export const ReplyContext = createContext<any>(null);

const ConversationId = ({ params }: { params: IParams }) => {
  axios.defaults.withCredentials = true;
  const [conversation, setConversation] = useState();
  const [replyMessage, setReplyMessage] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversations/${params.conversationId}`
      )
      .then((res) => {
        setConversation(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/messages/${params.conversationId}`
      )
      .then((res) => {
        // console.log(res)
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return conversation ? (
    <div className=" lg:pl-80 h-full">
      <div className="flex flex-col h-full">
        <ReplyContext.Provider value={{ replyMessage, setReplyMessage }}>
          <Header conversation={conversation} />
          <Body messages={messages} setMessages={setMessages} />
          <Form />
        </ReplyContext.Provider>
      </div>
    </div>
  ) : (
    <div className=" lg:pl-80 h-full">
      <div className="flex flex-col h-full">
        <EmptyStack />
      </div>
    </div>
  );
};

export default ConversationId;
