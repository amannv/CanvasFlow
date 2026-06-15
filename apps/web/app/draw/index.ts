import { createElementSchema } from "@repo/zod/types";
import { BACKEND_URL } from "../config/config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const parsedMessage = JSON.parse(event.data);

    if (parsedMessage.type === "create_element") {
      existingShapes.push(parsedMessage.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  clearCanvas(existingShapes, canvas, ctx);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape: Shape = {
      type: "rect",
      width: width,
      height: height,
      x: startX,
      y: startY,
    };

    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "create_element",
        payload: {
          shape: shape,
          type: shape.type,
          roomId: roomId,
        },
      }),
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "rgba(255, 255, 255, 1)";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255, 1)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string) {
  const response = await axios.get(`${BACKEND_URL}/elements/${roomId}`);
  const data = response.data.elements;
  const shapes = data.map((s: any) => ({
    type: s.type,
    ...s.data,
  }));

  return shapes;
}
