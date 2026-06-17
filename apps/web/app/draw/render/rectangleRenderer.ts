import { RectangleShape } from "../types";

export function renderRectangle({
  ctx,
  shape,
}: {
  ctx: CanvasRenderingContext2D;
  shape: RectangleShape;
}) {
  ctx.strokeStyle = "white";
  ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
}
