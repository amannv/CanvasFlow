import { Shape, WorldToScreen } from "./types";
import { renderRectangle } from "../tools/rectangle/rectangleTool";
import { renderCircle } from "../tools/circle/circleTool";
import { renderLine } from "../tools/line/lineTool";
import { renderArrow } from "../tools/arrow/ArrowTool";
import { renderPencil } from "../tools/pencil/pencilTool";
import { renderText } from "../tools/text/textTool";

export function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen,
) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const origin = worldToScreen(0, 0);
  const scale = origin.scale;
  
  ctx.strokeStyle = "rgba(0, 0, 0, 1)";
  ctx.lineWidth = 1 / (window.devicePixelRatio || 1);
  const gridSize = 100 * scale;
  
  const startX = origin.screenX % gridSize;
  const startY = origin.screenY % gridSize;

  ctx.beginPath();
  for (let x = startX; x < window.innerWidth; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, window.innerHeight);
  }
  for (let y = startY; y < window.innerHeight; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(window.innerWidth, y);
  }
  ctx.stroke();

  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      renderRectangle(ctx, shape, selectedShapeId, worldToScreen);
    }
    if (shape.type === "circle") {
      renderCircle(ctx, shape, selectedShapeId, worldToScreen);
    }
    if (shape.type === "line") {
      renderLine(ctx, shape, selectedShapeId, worldToScreen);
    }
    if (shape.type === "text") {
      renderText(ctx, shape, selectedShapeId, worldToScreen);
    }
    if (shape.type === "pencil") {
      renderPencil(ctx, shape, selectedShapeId, worldToScreen);
    }
    if (shape.type === "arrow") {
      renderArrow(ctx, shape, selectedShapeId, worldToScreen);
    }
  });
}
