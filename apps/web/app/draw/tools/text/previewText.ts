export function previewText(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
) {
  ctx.font = "48px serif";
  ctx.fillText(text, x, y);
}
