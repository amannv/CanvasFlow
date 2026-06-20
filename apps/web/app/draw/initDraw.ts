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
import { createText } from "./tools/text/createText";
import { previewPencil } from "./tools/pencil/previewPencil";
import { createPencil } from "./tools/pencil/createPencil";
import { previewArrow } from "./tools/arrow/previewArrow";
import { createArrow } from "./tools/arrow/createArrow";
import { isPointInsideRectangle } from "./tools/rectangle/isPointInsideRectangle";

type ShapeType =
  | "circle"
  | "rectangle"
  | "line"
  | "pencil"
  | "none"
  | "text"
  | "arrow";

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  shape: React.RefObject<ShapeType>,
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

  canvas.addEventListener("mousedown", (e) => {
    console.log(existingShapes);
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

    for (let i = 0; i < existingShapes.length; i++) {
      const shape = existingShapes[i];

      if (!shape?.id) continue;

      if (shape.type !== "rect") continue;

      if (isPointInsideRectangle(pos.x, pos.y, shape)) {
        state.selectedShapeId = shape.id;
        state.isDraggingShape = true;

        state.dragOffsetX = pos.x - shape.x;
        state.dragOffsetY = pos.y - shape.y;

        clearCanvas(existingShapes, canvas, ctx, state.selectedShapeId);
        break;
      }
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!state.clicked) return;

    clearCanvas(existingShapes, canvas, ctx, state.selectedShapeId);

    const pos = getCanvasCoordinates(e, canvas);

    if (shape.current === "rectangle") {
      previewRectangle(ctx, state.startX, state.startY, pos.x, pos.y);
    }
    if (shape.current === "circle") {
      previewCircle(ctx, state.startX, state.startY, pos.x, pos.y);
    }
    if (shape.current === "line") {
      previewLine(ctx, state.startX, state.startY, pos.x, pos.y);
    }
    if (shape.current === "pencil") {
      state.currentStroke.push({
        x: pos.x,
        y: pos.y,
      });
      previewPencil(ctx, state.currentStroke);
    }
    if (shape.current === "arrow") {
      previewArrow(ctx, state.startX, state.startY, pos.x, pos.y);
    }

    if (state.isDraggingShape && state.selectedShapeId) {
      const selectedShape = existingShapes.find(
        (shape) => shape.id === state.selectedShapeId,
      );

      if (selectedShape && selectedShape.type === "rect") {
        selectedShape.x = pos.x - state.dragOffsetX;
        selectedShape.y = pos.y - state.dragOffsetY;
      }

      clearCanvas(existingShapes, canvas, ctx, state.selectedShapeId);
      return;
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    handleMouseUp(state);
    const pos = getCanvasCoordinates(e, canvas);

    if (state.isDraggingShape && state.selectedShapeId) {
      const selectedShape = existingShapes.find(
        (shape) => shape.id === state.selectedShapeId,
      );

      if (selectedShape?.id) {
        updateElementSender(selectedShape.id, socket, selectedShape, roomId);
      }
      state.isDraggingShape = false;
      return;
    }

    if (shape.current === "rectangle") {
      const rectangle = createRectangle(
        state.startX,
        state.startY,
        pos.x,
        pos.y,
      );
      existingShapes.push(rectangle);
      createElementSender(socket, rectangle, roomId);
    }
    if (shape.current === "circle") {
      const circle = createCircle(state.startX, state.startY, pos.x, pos.y);
      existingShapes.push(circle);
      createElementSender(socket, circle, roomId);
    }
    if (shape.current === "line") {
      const line = createLine(state.startX, state.startY, pos.x, pos.y);
      existingShapes.push(line);
      createElementSender(socket, line, roomId);
    }
    if (shape.current === "pencil") {
      const pencil = createPencil(state.currentStroke);
      existingShapes.push(pencil);
      createElementSender(socket, pencil, roomId);
    }
    if (shape.current === "arrow") {
      const arrow = createArrow(state.startX, state.startY, pos.x, pos.y);
      existingShapes.push(arrow);
      createElementSender(socket, arrow, roomId);
    }
  });
}
