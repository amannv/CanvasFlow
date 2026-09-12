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
              strokeWidth={2.25}
              fill={cursor.color}
              color="#111111"
              className="-rotate-12 drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]"
            />
            <div
              className="absolute left-5 top-5 whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium text-black"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>
          </div>
        );
      })}

      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-52 flex-col gap-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className="rounded-md border border-white/10 bg-[#111111]/95 px-3 py-2 text-xs text-white/80 shadow-lg"
          >
            {message.text}
          </div>
        ))}
      </div>
    </>
  );
}