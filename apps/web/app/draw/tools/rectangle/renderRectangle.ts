import { RectangleShape } from "../../utils/types";

export function renderRectangle(
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
) {
  ctx.strokeStyle = "black";
  ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
}
