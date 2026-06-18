import { useEffect, useRef, useState } from "react";
import { initDraw } from "../draw/initDraw";
import {
  RectangleHorizontal,
  Circle,
  Minus,
  PencilLine,
  MousePointer,
  Type,
} from "lucide-react";

type ShapeType = "circle" | "rectangle" | "line" | "pencil" | "none" | "text";

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

  useEffect(() => {
    shapeRef.current = shape;
  }, [shape]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      initDraw(canvas, roomId, socket, shapeRef);
    }
  }, [canvasRef]);

  return (
    <div>
      <canvas ref={canvasRef} className="fixed inset-0 bg-neutral-50" />
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
              setShape("none");
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
