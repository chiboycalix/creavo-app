"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { webSocketUrl } from "@/utils/constant";

// Define the WebSocket context type
interface WebSocketContextType {
  ws: Socket | null;
}

// Create a WebSocket context
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

// WebSocketProvider component to wrap your app
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [ws, setWs] = useState<Socket | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const socket = io(webSocketUrl, {
      autoConnect: true,
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token: `Bearer ${token}` },
    });

    socket.on("connect", () => console.log("WebSocket connected lobby", socket.id));
    socket.on("disconnect", () => console.log("WebSocket disconnected"));

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  return <WebSocketContext.Provider value={{ ws }}>{children}</WebSocketContext.Provider>;
};

// Custom Hook to access WebSocket safely
export const useWebSocket = (): Socket | null => {
  const context = useContext(WebSocketContext);
  return context?.ws ?? null; // Avoids TypeScript error
};
