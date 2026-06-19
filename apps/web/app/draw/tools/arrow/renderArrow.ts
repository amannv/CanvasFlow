import { ArrowType } from "../../utils/types";

export function renderArrow(ctx: CanvasRenderingContext2D, shape: ArrowType) {
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
}
