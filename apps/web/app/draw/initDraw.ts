import { getExistingShapes } from "./network/api";
import { clearCanvas } from "./render/clearCanvas";
import { createRectangle } from "./shapes/rectangle";
import { Shape } from "./types";
import { getCanvasCoordinates } from "./utils/getCanvasCoordinates";
import { previewCircle } from "./tools/circleTool";
import { createCircle } from "./shapes/circle";
import { socketMessageSender, socketMessageListener } from "./network/socket";
import {
  handleMouseDown,
  handleMouseUp,
  previewRectangle,
} from "./tools/rectangleTool";
import React from "react";

type ShapeType = "circle" | "rectangle" | "line" | "pencil" | "none";

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  shape: React.RefObject<ShapeType>,
) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (!ctx) {
    return;
  }

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  socketMessageListener(socket, existingShapes, canvas, ctx);

  clearCanvas(existingShapes, canvas, ctx);

  const state = {
    clicked: false,
    startX: 0,
    startY: 0,
  };

  canvas.addEventListener("mousedown", (e) => {
    const pos = getCanvasCoordinates(e, canvas);
    state.startX = pos.x;
    state.startY = pos.y;
    handleMouseDown(state);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!state.clicked) return;

    clearCanvas(existingShapes, canvas, ctx);

    const pos = getCanvasCoordinates(e, canvas);

    if (shape.current === "rectangle") {
      previewRectangle(ctx, state.startX, state.startY, pos.x, pos.y);
    }
    if (shape.current === "circle") {
      previewCircle(ctx, state.startX, state.startY, pos.x, pos.y);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    handleMouseUp(state);
    const pos = getCanvasCoordinates(e, canvas);

    if (shape.current === "rectangle") {
      const rectangle = createRectangle(
        state.startX,
        state.startY,
        pos.x,
        pos.y,
      );
      existingShapes.push(rectangle);
      socketMessageSender(socket, rectangle, roomId);
    }
    if (shape.current === "circle") {
      const circle = createCircle(state.startX, state.startY, pos.x, pos.y);
      existingShapes.push(circle);
      socketMessageSender(socket, circle, roomId);
    }
  });
}
