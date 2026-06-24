import { LineShape } from "../../utils/types";

export function renderLine(
  ctx: CanvasRenderingContext2D, 
  shape: LineShape,
  selectedShapeId: number | null,
) {

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(shape.startX, shape.startY);
  ctx.lineTo(shape.endX, shape.endY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  if (selectedShapeId === shape.id) {
  ctx.beginPath();
  ctx.arc(shape.startX, shape.startY, 5, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(shape.endX, shape.endY, 5, 0, Math.PI * 2);
  ctx.fill();
}

  ctx.restore();
}
