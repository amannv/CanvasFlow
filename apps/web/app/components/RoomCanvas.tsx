"use client";
import { useEffect, useState } from "react";

import { WS_URL } from "../config/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const ws = new WebSocket(
      `${WS_URL}?token=${encodeURIComponent(token)}`,
    );
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join_room",
          payload: {
            roomId: roomId,
          },
        }),
      );
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [roomId]);

  if (!socket) {
    return <div>Connecting to Server</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
