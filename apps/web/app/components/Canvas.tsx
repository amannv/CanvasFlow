import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DrawEngine } from "../draw/engine/DrawEngine";
import {
  RectangleHorizontal,
  Circle,
  Minus,
  PencilLine,
  MousePointer,
  Type,
  ArrowUpRight,
  Hand,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

import { createText } from "../draw/tools/text/textTool";
import { createElementSender } from "../draw/network/socket";
import { ShapeType, RemoteCursor } from "../draw/utils/types";
import {
  CursorPresence,
  PresenceMessage,
} from "./CursorPresence";

const cursorColors = ["#38bdf8", "#fb7185", "#a3e635", "#fbbf24", "#c084fc"];

function getFirstName(name?: string) {
  return name?.trim().split(/\s+/)[0] || "Guest";
}

function getCursorColor(userId: number) {
  return cursorColors[userId % cursorColors.length] ?? "#38bdf8";
}

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shape, setShape] = useState<ShapeType>("none");
  const [cursors, setCursors] = useState<Record<number, RemoteCursor>>({});
  const [presenceMessages, setPresenceMessages] = useState<PresenceMessage[]>([]);
  const shapeRef = useRef<ShapeType>("none");
  const engineRef = useRef<DrawEngine | null>(null);
  const [textEditor, setTextEditor] = useState<{
    worldX: number;
    worldY: number;
  } | null>(null);
  const [textValue, setTextValue] = useState<string>("");
  const [cameraVersion, setCameraVersion] = useState(0);

  useEffect(() => {
    shapeRef.current = shape;
  }, [shape]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    engineRef.current = new DrawEngine(
      canvas,
      roomId,
      socket,
      shapeRef,
      (worldX, worldY) => {
        setTextEditor({ worldX, worldY });
      },
      () => {
        setCameraVersion((v) => v + 1);
      },
      (userId, name, worldX, worldY) => {
        setCursors((prev) => ({
          ...prev,
          [userId]: {
            userId,
            x: worldX,
            y: worldY,
            name: getFirstName(name),
            color: getCursorColor(userId),
          },
        }));
      },

      (userId) => {
        setCursors((prev) => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      },
      (userId, name) => {
        const message = {
          id: `${userId}-${Date.now()}`,
          text: `${getFirstName(name)} joined the canvas`,
        };
        setPresenceMessages((previous) => [...previous, message]);
        window.setTimeout(() => {
          setPresenceMessages((previous) =>
            previous.filter((item) => item.id !== message.id),
          );
        }, 3000);
      },
      (userId, name) => {
        setCursors((previous) => {
          const next = { ...previous };
          delete next[userId];
          return next;
        });

        const message = {
          id: `${userId}-${Date.now()}`,
          text: `${getFirstName(name)} left the canvas`,
        };
        setPresenceMessages((previous) => [...previous, message]);
        window.setTimeout(() => {
          setPresenceMessages((previous) =>
            previous.filter((item) => item.id !== message.id),
          );
        }, 3000);
      },
    );

    document.fonts.ready.then(() => {
      engineRef.current?.render();
    });

    return () => {
      engineRef.current?.destroy();
    };
  }, [roomId, socket]);

  const screenPosition =
    textEditor && engineRef.current
      ? engineRef.current.worldToScreen(textEditor.worldX, textEditor.worldY)
      : null;
  const tools: [ShapeType, LucideIcon, string][] = [
    ["pointer", MousePointer, "Select"],
    ["move", Hand, "Pan"],
    ["pencil", PencilLine, "Pencil"],
    ["line", Minus, "Line"],
    ["rectangle", RectangleHorizontal, "Rectangle"],
    ["circle", Circle, "Circle"],
    ["arrow", ArrowUpRight, "Arrow"],
    ["text", Type, "Text"],
  ];

  const worldToScreen = (worldX: number, worldY: number) =>
    engineRef.current?.worldToScreen(worldX, worldY) ?? {
      screenX: worldX,
      screenY: worldY,
      scale: 1,
    };

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="fixed inset-0 bg-[#ffffff] bg-grid" />
      <CursorPresence
        cursors={cursors}
        worldToScreen={worldToScreen}
        messages={presenceMessages}
      />

      {textEditor && (
        <textarea
          ref={(el) => {
            if (el && document.activeElement !== el) {
              setTimeout(() => el.focus(), 0);
            }
          }}
          autoFocus
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value);
            e.target.style.height = "0px";
            e.target.style.height = `${e.target.scrollHeight}px`;
            e.target.style.width = "0px";
            e.target.style.width = `${e.target.scrollWidth}px`;
          }}
          onBlur={() => {
            if (textValue.trim() !== "") {
              const textShape = createText(
                textEditor.worldX,
                textEditor.worldY,
                textValue,
              );
              if (engineRef.current) {
                engineRef.current.addShape(textShape);
              }
              createElementSender(socket, textShape, roomId);
            }
            setTextEditor(null);
            setTextValue("");
          }}
          className="absolute z-50 bg-transparent outline-none resize-none overflow-hidden whitespace-pre"
          style={{
            left: screenPosition?.screenX,
            top: screenPosition?.screenY,
            fontSize: `${24 * (screenPosition?.scale ?? 1)}px`,
            fontFamily: "Sniglet",
            color: "var(--foreground)",
            minHeight: "1.2em",
            minWidth: "1em",
            lineHeight: 1.2,
            padding: 0,
            margin: 0,
            border: "none",
          }}
        />
      )}
      <div className="pointer-events-none fixed inset-0">
        <div className="pointer-events-auto absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-4">
          <div className="flex items-center gap-1 rounded-base border-2 border-border shadow-shadow bg-[#ffffff] p-2">
            <div
              className="flex items-center gap-1"
              role="toolbar"
              aria-label="Drawing tools"
            >
              {tools.map(([tool, Icon, label]) => (
                <Button
                  key={tool as string}
                  type="button"
                  onClick={() => setShape(tool as ShapeType)}
                  variant="outline"
                  className={shape === tool ? "bg-main text-white hover:bg-main hover:text-white" : "bg-[#ffffff] text-black hover:bg-[#ffffff]"}
                  size="icon"
                  title={label as string}
                  aria-label={label as string}
                  aria-pressed={shape === tool}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center rounded-base border-2 border-border shadow-shadow bg-[#ffffff] p-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2"
              title="Exit to dashboard"
            >
              <LogOut size={18} strokeWidth={2.2} />
              <span className="hidden sm:inline font-bold">Exit</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
