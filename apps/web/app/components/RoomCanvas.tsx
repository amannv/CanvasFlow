"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { WS_URL } from "../config/config";
import { Canvas } from "./Canvas";
import { CanvasLoading } from "./CanvasLoading";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/signin");
      return;
    }

    setAuthChecked(true);

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join_room",
          payload: {
            roomId: Number(roomId),
          },
        }),
      );
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [roomId, router]);

  if (!authChecked) {
    return null;
  }

  if (!socket) {
    return <CanvasLoading />;
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
