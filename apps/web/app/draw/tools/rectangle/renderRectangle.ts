import { RectangleShape } from "../../utils/types";

export function renderRectangle(
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
  selectedShapeId: number | null,
) {

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

  ctx.strokeRect(
    shape.x,
    shape.y,
    shape.width,
    shape.height
  );

  if (shape.id === selectedShapeId) {

    ctx.strokeStyle = "blue";
    ctx.setLineDash([5, 5]);

    ctx.strokeRect(
      shape.x - 5,
      shape.y - 5,
      shape.width + 10,
      shape.height + 10
    );
  }

  ctx.restore();
}