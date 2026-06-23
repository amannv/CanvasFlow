export function previewRectangle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
) {
  const width = currentX - startX;
  const height = currentY - startY;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.strokeRect(startX, startY, width, height);
}

