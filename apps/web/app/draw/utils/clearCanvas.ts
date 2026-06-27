import { Shape } from "./types";
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
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      renderRectangle(ctx, shape, selectedShapeId);
    }
    if (shape.type === "circle") {
      renderCircle(ctx, shape, selectedShapeId);
    }
    if (shape.type === "line") {
      renderLine(ctx, shape, selectedShapeId);
    }
    if (shape.type === "text") {
      renderText(ctx, shape, selectedShapeId);
    }
    if (shape.type === "pencil") {
      renderPencil(ctx, shape, selectedShapeId);
    }
    if (shape.type === "arrow") {
      renderArrow(ctx, shape, selectedShapeId);
    }
  });
}
