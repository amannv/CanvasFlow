export function previewLine(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}
