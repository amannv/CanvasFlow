import { TextShape } from "../../utils/types";

export function renderText(
  ctx: CanvasRenderingContext2D, 
  shape: TextShape,
  selectedShapeId: number | null
) {
  ctx.save();

  ctx.font = "24px Sniglet";
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.fillText(shape.text, shape.x, shape.y);

  if (selectedShapeId === shape.id) {
    const width = ctx.measureText(shape.text).width;
    const height = 24;

    ctx.strokeStyle = "blue";
    ctx.setLineDash([5,5]);

    ctx.strokeRect(
      shape.x - 5,
      shape.y - 5,
      width + 10,
      height + 10
    )
  }

  ctx.restore();
}
