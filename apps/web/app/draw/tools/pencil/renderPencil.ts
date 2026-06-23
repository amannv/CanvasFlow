import { PencilShape } from "../../utils/types";

export function renderPencil(
  ctx: CanvasRenderingContext2D,
  shape: PencilShape,
) {
  const startingPoint = shape.points[0];

  if (!startingPoint) return;

  ctx.beginPath();

  ctx.moveTo(startingPoint.x, startingPoint.y);

  for (let i = 1; i < shape.points.length; i++) {
    const point = shape.points[i];

    if (!point) return;

    ctx.lineTo(point.x, point.y);
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}
