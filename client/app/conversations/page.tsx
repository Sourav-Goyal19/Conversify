"use client";
import clsx from "clsx";
import useConversation from "@/hooks/useConversation";
import EmptyStack from "@/components/EmptyStack";
import axios from "axios";

const Home = () => {
  axios.defaults.withCredentials = true;
  const { isOpen } = useConversation();
  return (
    <div
      className={clsx("h-full lg:pl-80 lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyStack />
    </div>
  );
};

export default Home;
