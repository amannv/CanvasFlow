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

import { createText } from "../draw/tools/text/textTool";
import { createElementSender } from "../draw/network/socket";
import { ShapeType, RemoteCursor } from "../draw/utils/types";

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
  const shapeRef = useRef<ShapeType>("none");
  const engineRef = useRef<DrawEngine | null>(null);
  const [textEditor, setTextEditor] = useState<{
    worldX: number;
    worldY: number;
  } | null>(null);
  const [textValue, setTextValue] = useState<string>("");
  const [cameraVersion, setCameraVersion] = useState(0);

  console.log("REMOTE CURSORS:", cursors);

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
      (userId, worldX, worldY) => {
        setCursors((prev) => ({
          ...prev,
          [userId]: {
            userId,
            x: worldX,
            y: worldY,
            name: `User ${userId}`,
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

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="fixed inset-0 bg-[#0a0a0a]" />

      {Object.values(cursors).map((cursor) => {
        const screen = engineRef.current?.worldToScreen(cursor.x, cursor.y);

        if (!screen) return null;

        return (
          <div
            key={cursor.userId}
            className="pointer-events-none fixed z-40"
            style={{
              left: screen.screenX,
              top: screen.screenY,
            }}
          >
            <div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderLeft: "16px solid #38bdf8",
                transform: "rotate(-45deg)",
                transformOrigin: "0 0",
              }}
            />

            <div className="absolute left-4 top-3 whitespace-nowrap rounded-md bg-[#38bdf8] px-2 py-1 text-xs font-medium text-white">
              {cursor.name}
            </div>
          </div>
        );
      })}

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
            color: "#ffffff",
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
        <div className="pointer-events-auto absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <div className="rounded-lg border border-white/10 bg-[#111111] p-1.5">
            <div
              className="flex items-center gap-1"
              role="toolbar"
              aria-label="Drawing tools"
            >
              {tools.map(([tool, Icon, label]) => (
                <button
                  key={tool as string}
                  type="button"
                  onClick={() => setShape(tool as ShapeType)}
                  className={`grid size-10 place-items-center rounded-md transition ${shape === tool ? "bg-[#38bdf8] text-[#0a0a0a]" : "text-white/55 hover:bg-white/10 hover:text-white"}`}
                  title={label as string}
                  aria-label={label as string}
                  aria-pressed={shape === tool}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#111111] p-1.5">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex h-10 items-center gap-2 rounded-md px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/55 transition hover:bg-white/10 hover:text-[#38bdf8]"
              title="Exit to dashboard"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
