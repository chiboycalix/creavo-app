import React, { useEffect, useState, useRef } from "react";
import { useWebSocket } from "@/context/WebSocket";

interface SocketProps {
  username: string;
  setUser: (user: any) => void; 
}

interface WebSocketResponse {
  status: string;
  message: string;
  data?: string[];
}

const Socket: React.FC<SocketProps> = ({ username, setUser }) => {
  const ws = useWebSocket();
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [response, setResponse] = useState<WebSocketResponse | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const wsRef = useRef<typeof ws | null>(null);

  useEffect(() => {
    wsRef.current = ws;
    try {
      if (ws) {
        ws.connect();

        ws.on("auth_error", (error: string) => {
          setAlert(error);
        });

        ws.on("suggested_username_response", (response: WebSocketResponse) => {
          setResponse(response);
          setLoading(false);
          setSuggestedUsernames(response.data || []);
        });

        ws.on("profileUpdated", (updatedUser) => {
          if (updatedUser.username === username) {
            setUser(updatedUser); // Update state when a profile update is received
          }
        });

        ws.on("connect_error", (error) => {
          setAlert(`${error}`);
          setLoading(false);
        });
      }
    } catch (error) {
      setAlert(String(error));
      setLoading(false);
    }
  }, [ws, username, setUser]);

  useEffect(() => {
    if (wsRef.current && username.length > 0) {
      setLoading(true);
      wsRef.current.emit("suggest_username_request", username, () => {});
    }
  }, [username]);

  return (
    <div className="px-3 pt-2">
      {loading ? (
        <p className="text-sm">Loading...</p>
      ) : (
        response?.status === "Success" &&
        suggestedUsernames &&
        suggestedUsernames.length > 0 && (
          <div>
            <p className="text-sm text-[#37169C] font-medium">
              {response.message}
            </p>
            <span className="text-sm italic">
              {Array.isArray(suggestedUsernames) &&
              suggestedUsernames.length > 0
                ? suggestedUsernames.join(", ")
                : "No suggestions available"}
            </span>
          </div>
        )
      )}
      {response?.status === "Error" && (
        <div>
          <p className="text-sm text-[#37169C] font-medium">
            😔 {response.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Socket;
