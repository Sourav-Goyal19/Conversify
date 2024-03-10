"use client";

import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { useEffect, useState } from "react";

interface IParams {
  conversationId: string;
}

const SERVER_URL = "http://localhost:8000";

const ConversationId = ({ params }: { params: IParams }) => {
  const [conversation, setConversation] = useState([]);
  const [messages, setMessages] = useState([]);
  const user = useAppSelector((state) => state.user.user);
  console.log(user);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/conversations/${params.conversationId}`)
      .then((res) => {
        console.log(res.data);
        setConversation(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${SERVER_URL}/api/messages/${params.conversationId}`)
      .then((res) => {
        console.log(res.data);
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <div>ConversationId</div>;
};

export default ConversationId;
