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
import GroupChatModal from "./GroupChatModal";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user/user/userSlice";

interface ConversationListProps {
  intialItems: any[];
}

const ConversationList: React.FC<ConversationListProps> = () => {
  const { isOpen, conversationId } = useConversation();
  const [conversations, setConversations] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState([]);
  const [items, setItems] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!user) return router.push("/");
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversations/all`, {
        params: {
          userId: user?._id,
        },
      })
      .then((res) => {
        setConversations(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        toast.error(err.msg);
        console.log(err);
      });

    const fetchUsers = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/authorization`;
        const { data } = await axios.get(url, { withCredentials: true });
        if (data) {
          dispatch(setUser(data.user));
          if (data?.user?.email) {
            axios
              .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getallusers`, {
                params: { email: data.user?.email },
              })
              .then((res) => {
                setAllUsers(res.data.users);
                console.log(res.data.users);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else router.push("/");
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <GroupChatModal
        users={allUsers}
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
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
            <div
              onClick={() => setIsGroupModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition dark:bg-secondary dark:text-accent-1 dark:ring-slate-300"
            >
              <MdOutlineGroupAdd size={22} />
            </div>
          </div>
          {conversations.map((item, index) => (
            <ConversationBox
              key={index}
              data={item}
              selected={conversationId == item?._id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
