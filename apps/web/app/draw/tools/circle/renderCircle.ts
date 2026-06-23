import { CircleShape } from "../../utils/types";

export function renderCircle(
  ctx: CanvasRenderingContext2D,
  shape: CircleShape,
) {
  ctx.beginPath();
  ctx.arc(shape.centreX, shape.centreY, shape.radius, 0, 2 * Math.PI);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}
