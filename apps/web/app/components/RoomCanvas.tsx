"use client";
import { useEffect, useState } from "react";

import { WS_URL } from "../config/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc4MTk0MzUxOH0.-awkSGRO7JIJVKyKdbNbFemKkEyIXMrc4XKUARaNXzg`,
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
  }, []);

  if (!socket) {
    return <div>Connecting to Server</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
