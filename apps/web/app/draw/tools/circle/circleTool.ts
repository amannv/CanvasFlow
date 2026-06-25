import { CircleShape } from "../../utils/types";

export function createCircle(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): CircleShape {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  const shape: CircleShape = {
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
) {
  const deltaX = currentX - startX;
  const deltaY = currentY - startY;

  const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}



export function renderCircle(
  ctx: CanvasRenderingContext2D,
  shape: CircleShape,
  selectedShapeId: number | null,
) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(shape.centreX, shape.centreY, shape.radius, 0, 2 * Math.PI);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  if (shape.id === selectedShapeId) {
    ctx.beginPath();
    ctx.arc(shape.centreX, shape.centreY, shape.radius + 5, 0, 2 * Math.PI);
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