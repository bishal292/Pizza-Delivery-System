import { useAppStore } from "@/Store/store";
import { HOST } from "@/utils/constant";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (socket.current) {
            socket.current.disconnect();
        }
        socket.current = io(HOST, {
            withCredentials: true,
            query: { userId: userInfo?._id},
        });

        socket.current.on("connect", () => {
            console.log("Connected to socket server");
        });

        socket.current.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });

        return () => {
            socket.current.disconnect();
        };
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};