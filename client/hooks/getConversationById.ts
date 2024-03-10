"use client";
import axios from "axios";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks/index";

const SERVER_URL = "http://localhost:8000";

const getConversationById = (conversationId: string) => {
  const [conversation, setConversation] = useState([]);
  const user = useAppSelector((state) => state.user.user);
  console.log(user);

  axios
    .get(`${SERVER_URL}/api/conversations/${conversationId}`)
    .then((res) => {
      console.log(res.data);
      setConversation(res.data);
    })
    .catch((err) => {
      console.log(err);
    });

  return conversation ? conversation : [];
};

export default getConversationById;
