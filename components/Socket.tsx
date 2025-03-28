import React, { useEffect, useState, useRef } from "react";
import { useWebSocket } from "@/context/WebSocket";
import { useToast } from "@/context/ToastContext";
interface SocketProps {
  username: string;
}

interface WebSocketResponse {
  status: string;
  message: string;
  data?: string[];
}

const Socket: React.FC<SocketProps> = ({ username }) => {
  const ws = useWebSocket();
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [response, setResponse] = useState<WebSocketResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const wsRef = useRef<typeof ws | null>(null);
  const { showToast, removeToast } = useToast();

  useEffect(() => {
    wsRef.current = ws;
    try {
      if (ws) {
        ws.connect();

        ws.on("auth_error", (error: string) => {
          showToast(
            'error',
            'Suggest Username Error',
            error
          );
        });

        ws.on("suggested_username_response", (response: WebSocketResponse) => {
          setResponse(response);
          setLoading(false);
          setSuggestedUsernames(response.data || []);
        });

        ws.on("connect_error", (error) => {
          console.log({ error })
          showToast(
            'error',
            'Suggest Username Error',
            "Connection error"
          );
          setLoading(false);
        });
      }
    } catch (error: any) {
      showToast(
        'error',
        'Something went wrong',
        error?.message
      );
      setLoading(false);
    } finally {
      setLoading(false);
      removeToast(10000);
    }
  }, [ws]);

  useEffect(() => {
    if (wsRef.current && username.length > 0) {
      setLoading(true);
      wsRef.current.emit("suggest_username_request", username, () => { });
    }
  }, [username]);

  return (
    <div className="px-3 pt-2 max-w-md">
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
            <p className="text-sm italic text-wrap max-w-md">
              {suggestedUsernames &&
                suggestedUsernames.length > 0 &&
                Array(suggestedUsernames)?.join(", ")}
            </p>
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