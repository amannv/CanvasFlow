import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

import { createText } from "../draw/tools/text/textTool";
import { createElementSender } from "../draw/network/socket";
import { ShapeType } from "../draw/utils/types";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shape, setShape] = useState<ShapeType>("none");
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
      }
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

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="fixed inset-0 bg-neutral-50" />
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
            color: "#000",
            minHeight: "1.2em",
            minWidth: "1em",
            lineHeight: 1.2,
            padding: 0,
            margin: 0,
            border: "none",
          }}
        />
      )}
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="absolute bottom-5 flex gap-2 bg-neutral-200 p-2 rounded">
          <div
            onClick={() => {
              setShape("rectangle");
            }}
            className="bg-neutral-100 text-black p-2 rounded cursor-pointer hover:scale-110"
          >
            <RectangleHorizontal />
          </div>
          <div
            onClick={() => {
              setShape("circle");
            }}
            className="bg-neutral-100 text-black  p-2 rounded cursor-pointer hover:scale-110"
          >
            <Circle />
          </div>
          <div
            onClick={() => {
              setShape("line");
            }}
            className="bg-neutral-100 text-black  p-2 rounded cursor-pointer hover:scale-110"
          >
            <Minus />
          </div>
          <div
            onClick={() => {
              setShape("pencil");
            }}
            className="bg-neutral-100 text-black p-2 rounded cursor-pointer hover:scale-110"
          >
            <PencilLine />
          </div>
          <div
            onClick={() => {
              setShape("text");
            }}
            className="bg-neutral-100 text-black p-2 rounded cursor-pointer hover:scale-110"
          >
            <Type />
          </div>
          <div
            onClick={() => {
              setShape("arrow");
            }}
            className="bg-neutral-100 text-black p-2 rounded cursor-pointer hover:scale-110"
          >
            <ArrowUpRight />
          </div>
          <div
            onClick={() => {
              setShape("pointer");
            }}
            className="bg-neutral-100 text-black p-2 rounded cursor-pointer hover:scale-110 "
          >
            <MousePointer />
          </div>
          <div
            onClick={() => {
              setShape("move");
            }}
            className="bg-neutral-100 text-black p-2 rounded cursor-pointer hover:scale-110 "
          >
            <Hand />
          </div>
        </div>
      </div>
    </div>
  );
}
