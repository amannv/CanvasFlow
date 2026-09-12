import type { RemoteCursor, WorldToScreen } from "../draw/utils/types";
import { MousePointer2 } from "lucide-react";

export type PresenceMessage = {
  id: string;
  text: string;
};

type CursorPresenceProps = {
  cursors: Record<number, RemoteCursor>;
  worldToScreen: WorldToScreen;
  messages: PresenceMessage[];
};

export function CursorPresence({
  cursors,
  worldToScreen,
  messages,
}: CursorPresenceProps) {
  const remoteCursors = Object.values(cursors);

  return (
    <>
      {remoteCursors.length > 0 && remoteCursors.map((cursor) => {
        const screen = worldToScreen(cursor.x, cursor.y);

        return (
          <div
            key={cursor.userId}
            className="pointer-events-none fixed z-40"
            style={{ left: screen.screenX, top: screen.screenY }}
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