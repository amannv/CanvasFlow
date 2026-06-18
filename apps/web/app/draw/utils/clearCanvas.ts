import { Shape } from "./types";
import { renderCircle } from "../tools/circle/renderCircle";
import { renderLine } from "../tools/line/renderLine";
import { renderPencil } from "../tools/pencil/renderPencil";
import { renderRectangle } from "../tools/rectangle/renderRectangle";
import { renderText } from "../tools/text/renderText";

export function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      renderRectangle(ctx, shape);
    }
    if (shape.type === "circle") {
      renderCircle(ctx, shape);
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
  });
}
