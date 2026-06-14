"use client";
import { useEffect, useRef } from "react";

import { WS_URL } from "../config/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({ slug }: { slug: string }) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      wsRef.current = ws;
    };
  }, []);

  if (!wsRef.current) {
    return <div>Connecting to Server</div>;
  }

  return <Canvas slug={slug} />;
}
