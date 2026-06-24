import { getExistingShapes } from "./network/api";
import {
  createElementSender,
  socketMessageListener,
  updateElementSender,
} from "./network/socket";
import { clearCanvas } from "./utils/clearCanvas";
import { createRectangle } from "./tools/rectangle/createRectangle";
import { Shape } from "./utils/types";
import { getCanvasCoordinates } from "./utils/getCanvasCoordinates";
import { previewCircle } from "./tools/circle/previewCircle";
import { createCircle } from "./tools/circle/createCircle";
import { handleMouseDown, handleMouseUp } from "./tools/mouse";
import { previewRectangle } from "./tools/rectangle/previewRectangle";
import { previewLine } from "./tools/line/previewLine";
import { createLine } from "./tools/line/createLine";
import { previewPencil } from "./tools/pencil/previewPencil";
import { createPencil } from "./tools/pencil/createPencil";
import { previewArrow } from "./tools/arrow/previewArrow";
import { createArrow } from "./tools/arrow/createArrow";
import { isPointInsideRectangle } from "./tools/rectangle/isPointInsideRectangle";
import { ShapeType } from "./utils/types";
import { RefObject } from "react";
import { isPointInsideCircle } from "./tools/circle/isPointInsideCircle";
import { isPointInsideLine } from "./tools/line/isPointOnLine";
import { isPointOnArrow } from "./tools/arrow/isPointOnArrow";
import { stat } from "fs";

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  shape: RefObject<ShapeType>,
  onTextClick: (x: number, y: number) => void,
) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (!ctx) {
    return;
  }

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  const state = {
    clicked: false,
    startX: 0,
    startY: 0,
    currentStroke: [] as {
      x: number;
      y: number;
    }[],
    selectedShapeId: null as number | null,

    isDraggingShape: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
  };

  socketMessageListener(
    socket,
    existingShapes,
    canvas,
    ctx,
    state.selectedShapeId,
  );

  clearCanvas(existingShapes, canvas, ctx, state.selectedShapeId);

  const mouseDownHandler = (e: MouseEvent) => {
    const pos = getCanvasCoordinates(e, canvas);
    state.startX = pos.x;
    state.startY = pos.y;
    handleMouseDown(state);

    if (shape.current === "pencil") {
      state.currentStroke = [];

      state.currentStroke.push({
        x: pos.x,
        y: pos.y,
      });
    }

    if (shape.current === "text") {
      onTextClick(pos.x, pos.y);
    }

    if (shape.current === "pointer") {
      let clickedOnShape = false;
      for (let i = existingShapes.length - 1; i >= 0; i--) {
        const shape = existingShapes[i];

        if (!shape?.id) continue;

        switch (shape.type) {
          case "rect":
          if (isPointInsideRectangle(pos.x, pos.y, shape)) {
          state.selectedShapeId = shape.id as number;
          state.isDraggingShape = true;

          state.dragOffsetX = pos.x - shape.x;
          state.dragOffsetY = pos.y - shape.y;
          clickedOnShape = true;
          }
          break;
          case "circle":
          if (isPointInsideCircle(pos.x, pos.y, shape)) {
          state.selectedShapeId = shape.id as number;
          state.isDraggingShape = true;

          state.dragOffsetX = pos.x - shape.centreX;
          state.dragOffsetY = pos.y - shape.centreY;
          clickedOnShape = true;
          }
          break;
          case "line":
          if (isPointInsideLine(
            ctx,
            pos.x,
            pos.y,
            shape.startX,
            shape.startY,
            shape.endX,
            shape.endY,
          )) {
            state.dragOffsetX = pos.x - shape.startX;
            state.dragOffsetY = pos.y - shape.startY;
            state.selectedShapeId =  shape.id;
            state.isDraggingShape = true;
            clickedOnShape = true;
          }
          break;
          case "arrow":
          if (isPointOnArrow(
            ctx,
            pos.x,
            pos.y,
            shape.x1,
            shape.y1,
            shape.x2,
            shape.y2,
          )) {
            state.dragOffsetX = pos.x - shape.x1;
            state.dragOffsetY = pos.y - shape.y1;
            state.selectedShapeId = shape.id;
            state.isDraggingShape = true;
            clickedOnShape = true;
          }
          break;
        }
      }
      if (!clickedOnShape) {
        state.selectedShapeId = null;
      }
      clearCanvas(existingShapes, canvas, ctx, state.selectedShapeId);
    }
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    const pos = getCanvasCoordinates(e, canvas);

    if (shape.current === "pointer") {
      if (state.isDraggingShape && state.selectedShapeId) {
        const selectedShape = existingShapes.find(
          (shape) => shape.id === state.selectedShapeId,
        );

        if (selectedShape && selectedShape.type === "rect") {
          selectedShape.x = pos.x - state.dragOffsetX;
          selectedShape.y = pos.y - state.dragOffsetY;
        }

        if (selectedShape && selectedShape.type === "circle") {
          selectedShape.centreX = pos.x - state.dragOffsetX;
          selectedShape.centreY = pos.y - state.dragOffsetY;
        }
        if (selectedShape && selectedShape.type === "line") {
          const linedx = selectedShape.endX - selectedShape.startX;
          const linedy = selectedShape.endY - selectedShape.startY;

          selectedShape.startX = pos.x - state.dragOffsetX;
          selectedShape.startY = pos.y - state.dragOffsetY;

          selectedShape.endX = selectedShape.startX + linedx;
          selectedShape.endY = selectedShape.startY + linedy;
        }
        if (selectedShape && selectedShape.type === "arrow") {
          const linedx = selectedShape.x2 - selectedShape.x1;
          const linedy = selectedShape.y2 - selectedShape.y1;

          selectedShape.x1 = pos.x - state.dragOffsetX;
          selectedShape.y1 = pos.y - state.dragOffsetY;

          selectedShape.x2 = linedx + selectedShape.x1;
          selectedShape.y2 = linedy + selectedShape.y1;
        }
        clearCanvas(existingShapes, canvas, ctx, state.selectedShapeId);
      }
      return;
    }

    if (!state.clicked) return;

    clearCanvas(existingShapes, canvas, ctx, state.selectedShapeId);

    switch (shape.current) {
      case "rectangle":
        previewRectangle(ctx, state.startX, state.startY, pos.x, pos.y);
        break;
      case "circle":
        previewCircle(ctx, state.startX, state.startY, pos.x, pos.y);
        break;
      case "line":
        previewLine(ctx, state.startX, state.startY, pos.x, pos.y);
        break;
      case "pencil":
        state.currentStroke.push({ x: pos.x, y: pos.y });
        previewPencil(ctx, state.currentStroke);
        break;
      case "arrow":
        previewArrow(ctx, state.startX, state.startY, pos.x, pos.y);
        break;
    }
  };

  const mouseUpHandler = (e: MouseEvent) => {
    handleMouseUp(state);
    const pos = getCanvasCoordinates(e, canvas);

    if (shape.current === "pointer") {
      if (state.isDraggingShape && state.selectedShapeId) {
        const selectedShape = existingShapes.find(
          (shape) => shape.id === state.selectedShapeId,
        );

        if (selectedShape?.id) {
          updateElementSender(selectedShape.id, socket, selectedShape, roomId);
        }
        state.isDraggingShape = false;
      }
      return;
    }

    const isClick =
      Math.abs(pos.x - state.startX) < 2 && Math.abs(pos.y - state.startY) < 2;

    if (isClick) {
      return;
    }

    let newShape: Shape | null = null;

    switch (shape.current) {
      case "rectangle":
        newShape = createRectangle(state.startX, state.startY, pos.x, pos.y);
        break;
      case "circle":
        newShape = createCircle(state.startX, state.startY, pos.x, pos.y);
        break;
      case "line":
        newShape = createLine(state.startX, state.startY, pos.x, pos.y);
        break;
      case "pencil":
        newShape = createPencil(state.currentStroke);
        break;
      case "arrow":
        newShape = createArrow(state.startX, state.startY, pos.x, pos.y);
        break;
    }

    if (newShape) {
      createElementSender(socket, newShape, roomId);
      console.log(existingShapes);
    }
  };

  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);

  return () => {
    canvas.removeEventListener("mousedown", mouseDownHandler);
    canvas.removeEventListener("mousemove", mouseMoveHandler);
    canvas.removeEventListener("mouseup", mouseUpHandler);
  };
}
