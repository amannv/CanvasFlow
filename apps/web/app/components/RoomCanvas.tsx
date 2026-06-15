"use client";
import { useEffect, useRef, useState } from "react";

import { WS_URL } from "../config/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc4MTUwNjA0OX0.X4WACBtmAyMe71ZFQ-I3-ELEooxh_8Yp11P2CvTz7ig`,
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
