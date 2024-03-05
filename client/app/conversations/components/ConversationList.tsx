"use client";
import useConversation from "@/hooks/useConversation";
import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import toast from "react-hot-toast";
import ConversationBox from "./ConversationBox";

interface ConversationListProps {
  intialItems: any[];
}

const SERVER_URL = "http://localhost:8000";

const ConversationList: React.FC<ConversationListProps> = () => {
  const [conversations, setConversations] = useState([]);
  const user = useAppSelector((state) => state.user.user);
  const { isOpen, conversationId } = useConversation();
  const router = useRouter();

  useEffect(() => {
    if (!user) return router.push("/");
    axios
      .get(`${SERVER_URL}/api/conversations/all`, {
        params: {
          userId: user._id,
        },
      })
      .then((res) => {
        console.log(res.data);
        setConversations(res.data);
      })
      .catch((err) => {
        toast.error(err.msg);
        console.log(err);
      });
  }, []);

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 dark:bg-primary dark:border-slate-800",
        isOpen ? "hidden" : "block w-full left-0"
      )}
    >
      <div className="px-5">
        <div className="flex justify-between mb-4 pt-4">
          <div className="text-2xl font-bold text-neutral-800 dark:text-accent-3">
            Messages
          </div>
          <div className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition dark:bg-secondary dark:text-accent-1 dark:ring-slate-300">
            <MdOutlineGroupAdd size={22} />
          </div>
        </div>
      </div>
      {conversations.map((item, index) => (
        <ConversationBox
          key={index}
          // data={item}
          // selected={conversationId == item?._id}
        />
      ))}
    </aside>
  );
};

export default ConversationList;
