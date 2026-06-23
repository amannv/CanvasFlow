import { Shape } from "./types";
import { renderCircle } from "../tools/circle/renderCircle";
import { renderLine } from "../tools/line/renderLine";
import { renderPencil } from "../tools/pencil/renderPencil";
import { renderRectangle } from "../tools/rectangle/renderRectangle";
import { renderText } from "../tools/text/renderText";
import { renderArrow } from "../tools/arrow/renderArrow";

export function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  selectedShapeId: number | null,
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
      renderLine(ctx, shape);
    }
    if (shape.type === "text") {
      renderText(ctx, shape);
    }
    if (shape.type === "pencil") {
      renderPencil(ctx, shape);
    }
    if (shape.type === "arrow") {
      renderArrow(ctx, shape);
    }
  });
}
