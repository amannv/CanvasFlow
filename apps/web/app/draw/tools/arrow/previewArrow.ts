import { ArrowType } from "../../utils/types";

export function previewArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
) {
  const headlen = 16;

  const dx = currentX - startX;
  const dy = currentY - startY;

  const angle = Math.atan2(dy, dx);

  ctx.beginPath();

  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);

  ctx.moveTo(currentX, currentY);
  ctx.lineTo(
    currentX - headlen * Math.cos(angle - Math.PI / 6),
    currentY - headlen * Math.sin(angle - Math.PI / 6),
  );

  ctx.moveTo(currentX, currentY);
  ctx.lineTo(
    currentX - headlen * Math.cos(angle + Math.PI / 6),
    currentY - headlen * Math.sin(angle + Math.PI / 6),
  );

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}
