import { PencilShape } from "../../utils/types";

export function createPencil(
    points: {
        x: number,
        y: number,
    }[],
): PencilShape {
    const shape: PencilShape = {
        type: "pencil",
        points: [...points],
    } 
    return shape;
}


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



export function renderPencil(
  ctx: CanvasRenderingContext2D,
  shape: PencilShape,
  selectedShapeId: number | null,
) {
  const startingPoint = shape.points[0];

  if (!startingPoint) return;

  ctx.save();

  ctx.beginPath();

  ctx.moveTo(startingPoint.x, startingPoint.y);

  for (let i = 1; i < shape.points.length; i++) {
    const point = shape.points[i];

    if (!point) continue;

    ctx.lineTo(point.x, point.y);
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  if (selectedShapeId === shape.id) {
    const minX = Math.min(...shape.points.map((p) => p.x));
    const minY = Math.min(...shape.points.map((p) => p.y));

    const maxX = Math.max(...shape.points.map((p) => p.x));
    const maxY = Math.max(...shape.points.map((p) => p.y));

    const width = maxX - minX;
    const height = maxY - minY;

    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "blue";

    ctx.strokeRect(
      minX - 5,
      minY - 5,
      width + 10,
      height + 10
    );
  }

  ctx.restore();
}



export function isPointOnPencil(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    shape: PencilShape
) {
    if (shape.points.length < 2) return;
    
    ctx.save();
    ctx.beginPath();

    ctx.moveTo(shape.points[0]!.x, shape.points[0]!.y);

    for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i]!.x, shape.points[i]!.y);
    }

    ctx.lineWidth = 10;

    const touch = ctx.isPointInStroke(mouseX, mouseY);

    ctx.restore();

    return touch;
}