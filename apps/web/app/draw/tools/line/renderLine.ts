import { LineShape } from "../../utils/types";

export function renderLine(ctx: CanvasRenderingContext2D, shape: LineShape) {
  ctx.beginPath();
  ctx.moveTo(shape.startX, shape.startY);
  ctx.lineTo(shape.endX, shape.endY);
  ctx.strokeStyle = "black";
  ctx.stroke();
}
