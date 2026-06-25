import { useEffect, useRef, useState } from "react";
import { initDraw } from "../draw/initDraw";
import { DrawEngine } from "../draw/DrawEngine";
import {
  RectangleHorizontal,
  Circle,
  Minus,
  PencilLine,
  MousePointer,
  Type,
  ArrowUpRight,
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
    x: number;
    y: number;
  } | null>(null);
  const [textValue, setTextValue] = useState<string>("");

  useEffect(() => {
    shapeRef.current = shape;
  }, [shape]);

  useEffect(() => {
     console.log("Canvas mounted");
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    engineRef.current = new DrawEngine(
      canvas,
      roomId,
      socket,
      shapeRef,
      (x, y) => {
        setTextEditor({ x, y });
      }
    );

    return () => {
          console.log("Canvas unmounted");
      console.log("cleanup engine listeners");
      engineRef.current?.destroy();
    }
  }, [roomId, socket]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="fixed inset-0 bg-neutral-50" />
      {textEditor && (
        <textarea
          autoFocus
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value);
          }}
          className="absolute z-50 bg-transparent outline-none resize-none"
          style={{
            left: textEditor.x,
            top: textEditor.y,
            fontSize: 24,
            fontFamily: "Sniglet",
            color: "#000",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              const textShape = createText(
                textEditor.x,
                textEditor.y,
                textValue,
              );

              createElementSender(socket, textShape, roomId);
              setTextEditor(null);
              setTextValue("");
            }
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
        </div>
      </div>
    </div>
  );
}
