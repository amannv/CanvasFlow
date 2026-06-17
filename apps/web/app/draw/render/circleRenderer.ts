import { CircleShape } from "../types";

export function renderCircle(
  ctx: CanvasRenderingContext2D,
  shape: CircleShape,
) {
  ctx.beginPath();
  ctx.arc(shape.centreX, shape.centreY, shape.radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.stroke();
}
