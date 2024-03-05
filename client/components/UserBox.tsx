"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Avatar from "./Avatar";
import axios from "axios";
import { useAppSelector } from "../redux/hooks";

interface UserBoxProps {
  user: any;
}

const SERVER_URL = "http://localhost:8000";

const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  const mainUser = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios
      .post(
        `${SERVER_URL}/api/conversations/`,
        {
          mainUserId: mainUser._id,
          userId: user._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        router.push(`/conversations/${res.data._id}`);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <div
      className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition-none cursor-pointer dark:bg-transparent dark:hover:bg-secondary"
      onClick={handleClick}
    >
      <Avatar image={user?.image} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className=" text-sm font-medium text-gray-900 dark:text-accent-3">
              {user.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
