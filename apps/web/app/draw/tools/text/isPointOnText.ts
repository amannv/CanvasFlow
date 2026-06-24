import { TextShape } from "../../utils/types";

export function isPointOnText(
  ctx: CanvasRenderingContext2D,
  mouseX: number,
  mouseY: number,
  shape: TextShape,
) {
  ctx.save();
  ctx.font = "24px Sniglet";
  ctx.textBaseline = "top";

  const width = ctx.measureText(shape.text).width;
  const height = 24;

  ctx.restore();

  return (
    mouseX >= shape.x &&
    mouseX <= shape.x + width &&
    mouseY >= shape.y &&
    mouseY <= shape.y + height
  )
}
