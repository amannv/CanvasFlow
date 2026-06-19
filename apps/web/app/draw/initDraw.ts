import { getExistingShapes } from "./network/api";
import { socketMessageSender, socketMessageListener } from "./network/socket";
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

type ShapeType = "circle" | "rectangle" | "line" | "pencil" | "none" | "text" | "arrow";

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

  socketMessageListener(socket, existingShapes, canvas, ctx);

  clearCanvas(existingShapes, canvas, ctx);

  const state = {
    clicked: false,
    startX: 0,
    startY: 0,
    currentStroke: [] as {
      x: number;
      y: number;
    }[],
  };

  canvas.addEventListener("mousedown", (e) => {
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
    if (shape.current === "line") {
      const line = createLine(state.startX, state.startY, pos.x, pos.y);
      existingShapes.push(line);
      socketMessageSender(socket, line, roomId);
    }
    if (shape.current === "pencil") {
      const pencil = createPencil(state.currentStroke);
      existingShapes.push(pencil);
      socketMessageSender(socket, pencil, roomId);
    }
    if (shape.current === "arrow") {
      const arrow = createArrow(state.startX, state.startY, pos.x, pos.y);
      existingShapes.push(arrow);
      socketMessageSender(socket, arrow, roomId);
    }
  });
}
