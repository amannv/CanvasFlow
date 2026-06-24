import { ArrowType } from "../../utils/types";

export function renderArrow(
  ctx: CanvasRenderingContext2D, 
  shape: ArrowType,
  selectedShapeId: number | null
) {

  ctx.save();

  const headlen = 16;

  const dx = shape.x2 - shape.x1;
  const dy = shape.y2 - shape.y1;

  const angle = Math.atan2(dy, dx);

  ctx.beginPath();

  ctx.moveTo(shape.x1, shape.y1);
  ctx.lineTo(shape.x2, shape.y2);

  ctx.moveTo(shape.x2, shape.y2);
  ctx.lineTo(
    shape.x2 - headlen * Math.cos(angle - Math.PI / 6),
    shape.y2 - headlen * Math.sin(angle - Math.PI / 6),
  );

  ctx.moveTo(shape.x2, shape.y2);
  ctx.lineTo(
    shape.x2 - headlen * Math.cos(angle + Math.PI / 6),
    shape.y2 - headlen * Math.sin(angle + Math.PI / 6),
  );

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (selectedShapeId === shape.id) {
    ctx.beginPath();
    ctx.arc(shape.x1, shape.y1, 5, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(shape.x2, shape.y2, 5, 0, Math.PI * 2); 
    ctx.fill();
  }

  ctx.restore();
}
