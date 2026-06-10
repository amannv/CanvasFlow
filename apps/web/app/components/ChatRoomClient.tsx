"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

type Shape = {
  id: string;
  type: string;
  data: any;
  roomId: string;
  userId: string;
};

export function ChatRoomClient({
  elements,
  id,
}: {
  elements: Shape[];
  id: string;
}) {
  const [shapes, setShapes] = useState<Shape[]>(elements);
  const [currentShapes, setCurrentShapes] = useState("");
  const { socket, loading } = useSocket();

  useEffect(() => {
    socket?.send(
      JSON.stringify({
        type: "join_room",
        payload: {
          roomId: id,
        },
      }),
    );

    if (socket && !loading) {
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "draw") {
          setShapes((e) => [...e, parsedData.shape]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <div>
      {shapes.map((shape, index) => (
        <div key={index}>{shape.type}</div>
      ))}

      <input
        type="text"
        value={currentShapes}
        onChange={(e) => {
          setCurrentShapes(e.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "draw",
              payload: {
                shape: currentShapes,
                roomId: id,
              },
            }),
          );
          setCurrentShapes("");
        }}
      >
        Send Shapes
      </button>
    </div>
  );
}
