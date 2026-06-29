import { CircleShape, WorldToScreen } from "../../utils/types";

export function createCircle(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): CircleShape {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  const shape: CircleShape = {
    id: crypto.randomUUID(),
    type: "circle",
    centreX: startX,
    centreY: startY,
    radius: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
  };
  return shape;
}


export function previewCircle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  worldToScreen: WorldToScreen

) {
  const start = worldToScreen(startX, startY);
  const current = worldToScreen(currentX, currentY);

  const deltaX = current.screenX - start.screenX;
  const deltaY = current.screenY - start.screenY;

  const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  ctx.beginPath();
  ctx.arc(start.screenX, start.screenY, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}



export function renderCircle(
  ctx: CanvasRenderingContext2D,
  shape: CircleShape,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen
) {
  const { screenX, screenY, scale } = worldToScreen(shape.centreX, shape.centreY);

  ctx.save();

  ctx.beginPath();
  ctx.arc(screenX, screenY, shape.radius * scale, 0, 2 * Math.PI);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  if (shape.id === selectedShapeId) {
    ctx.beginPath();
    ctx.arc(screenX, screenY, (shape.radius * scale) + 5, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
    ctx.setLineDash([5, 5]);
    ctx.stroke();
  }

  ctx.restore();
}


export function isPointInsideCircle(
    mouseX: number,
    mouseY: number,
    circle: CircleShape
) {
    const dx = mouseX - circle.centreX;
    const dy = mouseY - circle.centreY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;

}