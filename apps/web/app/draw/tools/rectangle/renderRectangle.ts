import { RectangleShape } from "../../utils/types";

export function renderRectangle(
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
  selectedShapeId: number | null,
) {
  console.log("RENDER", shape.id, selectedShapeId);

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
    console.log("DRAWING SELECTION");

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    ctx.strokeRect(
      shape.x - 10,
      shape.y - 10,
      shape.width + 20,
      shape.height + 20
    );
  }

  ctx.strokeStyle = "black";
  ctx.restore();
}