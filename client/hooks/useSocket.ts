import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // Replace with your server URL

export const useSocket = () => {
  const user = useAppSelector((state) => state.user.user);
  const [socketConnected, setSocketConnected] = useState(false);
  useEffect(() => {
    socket.on("connection", () => setSocketConnected(true));
    socket.emit("setup", user);
    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};
