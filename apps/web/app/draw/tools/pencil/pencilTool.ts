import { PencilShape, WorldToScreen } from "../../utils/types";

export function createPencil(
    points: {
        x: number,
        y: number,
    }[],
): PencilShape {
    const shape: PencilShape = {
        id: crypto.randomUUID(),
        type: "pencil",
        points: [...points],
    } 
    return shape;
}


export function previewPencil(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  worldToScreen: WorldToScreen
) {
  const screenPoints = points.map(point => {
    return worldToScreen(point.x, point.y);
  })

  const firstPoint = screenPoints[0];

  if (!firstPoint) return;

  ctx.beginPath();

  ctx.moveTo(firstPoint.screenX, firstPoint.screenY);

  for (let i = 1; i < points.length; i++) {
    const point = screenPoints[i];

    if (!point) continue;

    ctx.lineTo(point.screenX, point.screenY);
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}



export function renderPencil(
  ctx: CanvasRenderingContext2D,
  shape: PencilShape,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen,
) {

  const screenPoints = shape.points.map(shape => {
    return worldToScreen(shape.x, shape.y);
  });
  
  const startingPoint = screenPoints[0];

  if (!startingPoint) return;

  ctx.save();

  ctx.beginPath();

  ctx.moveTo(startingPoint.screenX, startingPoint.screenY);

  for (let i = 1; i < shape.points.length; i++) {
    const point = screenPoints[i];

    if (!point) continue;

    ctx.lineTo(point.screenX, point.screenY);
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  if (selectedShapeId === shape.id) {
    const minX = Math.min(...screenPoints.map((p) => p.screenX));
    const minY = Math.min(...screenPoints.map((p) => p.screenY));

    const maxX = Math.max(...screenPoints.map((p) => p.screenX));
    const maxY = Math.max(...screenPoints.map((p) => p.screenY));

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