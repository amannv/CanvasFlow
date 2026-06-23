import { CircleShape } from "../../utils/types";

export function renderCircle(
  ctx: CanvasRenderingContext2D,
  shape: CircleShape,
  selectedShapeId: number | null,
) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(shape.centreX, shape.centreY, shape.radius, 0, 2 * Math.PI);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  if (shape.id === selectedShapeId) {
    ctx.beginPath();
    ctx.arc(shape.centreX, shape.centreY, shape.radius + 5, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
    ctx.setLineDash([5, 5]);
    ctx.stroke();
  }

  ctx.restore();
}
