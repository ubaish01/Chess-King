import { useEffect, useState } from "react";

const WS_URL = import.meta.env.VITE_REACT_WS_URL;

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("Connected");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("Disconnected");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socket?.readyState === 1) {
        socket.close();
      }
    };
  }, []);

  return socket;
};
