import { TextShape } from "../../utils/types";

export function renderText(ctx: CanvasRenderingContext2D, shape: TextShape) {
  ctx.font = "24px Arial";
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.fillText(shape.text, shape.x, shape.y);
}
