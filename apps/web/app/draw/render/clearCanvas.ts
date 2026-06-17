import { Shape } from "../types";
import { renderCircle } from "./circleRenderer";
import { renderRectangle } from "./rectangleRenderer";

export function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      renderRectangle({ctx, shape});
    }
    if (shape.type === "circle"){
        renderCircle(ctx, shape);
    }
  });
}