import { RectangleShape } from "../../utils/types";

export function renderRectangle(
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
  selectedShapeId: number | null,
) {

  ctx.save();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.setLineDash([]);

  ctx.strokeRect(
    shape.x,
    shape.y,
    shape.width,
    shape.height
  );

  if (shape.id === selectedShapeId) {

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    ctx.strokeRect(
      shape.x - 10,
      shape.y - 10,
      shape.width + 20,
      shape.height + 20
    );
  }

  ctx.restore();
}