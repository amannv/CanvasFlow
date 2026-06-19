export function previewText(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
) {
  ctx.font = "24px Arial";
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.fillText(text, x, y);
}
