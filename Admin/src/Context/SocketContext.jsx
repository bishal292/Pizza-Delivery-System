import { useAppStore } from "@/Store/store";
import { HOST } from "@/utils/constant";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket.current) {
      socket.current.disconnect();
    }
    socket.current = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo?._id },
    });

    socket.current.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={{ socket: socket.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};