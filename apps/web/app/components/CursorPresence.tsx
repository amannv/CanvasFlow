import { forwardRef, useImperativeHandle, useState } from "react";
import type { RemoteCursor, WorldToScreen } from "../draw/utils/types";
import { MousePointer2 } from "lucide-react";

export type PresenceMessage = {
  id: string;
  text: string;
};

export type CursorPresenceRef = {
  updateCursor: (userId: number, name: string, color: string, x: number, y: number) => void;
  removeCursor: (userId: number) => void;
  addMessage: (message: PresenceMessage) => void;
};

type CursorPresenceProps = {
  worldToScreen: WorldToScreen;
};

export const CursorPresence = forwardRef<CursorPresenceRef, CursorPresenceProps>(
  ({ worldToScreen }, ref) => {
    const [cursors, setCursors] = useState<Record<number, RemoteCursor>>({});
    const [messages, setMessages] = useState<PresenceMessage[]>([]);

    useImperativeHandle(ref, () => ({
      updateCursor: (userId, name, color, x, y) => {
        setCursors((prev) => ({
          ...prev,
          [userId]: { userId, name, color, x, y },
        }));
      },
      removeCursor: (userId) => {
        setCursors((prev) => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      },
      addMessage: (message) => {
        setMessages((prev) => [...prev, message]);
        setTimeout(() => {
          setMessages((prev) => prev.filter((m) => m.id !== message.id));
        }, 3000);
      },
    }));

    const remoteCursors = Object.values(cursors);

    return (
      <>
        {remoteCursors.length > 0 &&
          remoteCursors.map((cursor) => {
            const screen = worldToScreen(cursor.x, cursor.y);

            return (
              <div
                key={cursor.userId}
                className="pointer-events-none fixed z-40"
                style={{
                  left: screen.screenX,
                  top: screen.screenY,
                  transition: "left 0.1s linear, top 0.1s linear",
                }}
              >
                <MousePointer2
                  size={32}
                  strokeWidth={2.5}
                  fill={cursor.color}
                  color="#000000"
                  className="-rotate-12"
                  style={{ filter: "drop-shadow(1px 1px 0px #000000)" }}
                />
                <div
                  className="absolute left-6 top-6 whitespace-nowrap rounded-md border-2 border-black px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black shadow-[2px_2px_0px_0px_#000000]"
                  style={{ backgroundColor: cursor.color }}
                >
                  {cursor.name}
                </div>
              </div>
            );
          })}

        <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-56 flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className="rounded-md border-2 border-black bg-white px-4 py-3 font-mono text-xs font-bold text-black shadow-[4px_4px_0px_0px_#000000]"
            >
              {message.text}
            </div>
          ))}
        </div>
      </>
    );
  }
);
CursorPresence.displayName = "CursorPresence";