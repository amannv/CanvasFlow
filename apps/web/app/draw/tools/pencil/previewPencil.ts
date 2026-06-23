export function previewPencil(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
) {
  const firstPoint = points[0];

  if (!firstPoint) return;

  ctx.beginPath();

  ctx.moveTo(firstPoint.x, firstPoint.y);

  for (let i = 1; i < points.length; i++) {
    const point = points[i];

    if (!point) continue;

    ctx.lineTo(point.x, point.y);
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}
