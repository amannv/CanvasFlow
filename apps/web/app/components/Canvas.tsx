import { useEffect, useRef } from "react";
import { initDraw } from "../draw";

export function Canvas({ roomId, socket } : {
    roomId: string;
    socket: WebSocket;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div>
      <canvas ref={canvasRef} className="fixed inset-0 bg-neutral-900" />
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="absolute bottom-5 flex gap-2">
          <div className="bg-neutral-700 text-white p-2 rounded">Rectangle</div>
          <div className="bg-neutral-700 text-white p-2 rounded">Circle</div>
        </div>
      </div>
    </div>
  );
}