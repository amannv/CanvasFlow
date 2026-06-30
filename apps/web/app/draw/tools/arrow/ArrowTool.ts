import { ArrowType, WorldToScreen } from "../../utils/types";

export function createArrow(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): ArrowType {
  const shape: ArrowType = {
    id: crypto.randomUUID(),
    type: "arrow",
    x1: startX,
    y1: startY,
    x2: endX,
    y2: endY,
  };
  return shape;
}

export function previewArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  worldToScreen: WorldToScreen
) {
  const start = worldToScreen(startX, startY);
  const current = worldToScreen(currentX, currentY);
  
  const headlen = 16;

  const dx = current.screenX - start.screenX;
  const dy = current.screenY - start.screenY;

  const angle = Math.atan2(dy, dx);

  ctx.beginPath();

  ctx.moveTo(start.screenX, start.screenY);
  ctx.lineTo(current.screenX, current.screenY);

  ctx.moveTo(current.screenX, current.screenY);
  ctx.lineTo(
    current.screenX - headlen * Math.cos(angle - Math.PI / 6),
    current.screenY - headlen * Math.sin(angle - Math.PI / 6),
  );

  ctx.moveTo(current.screenX, current.screenY);
  ctx.lineTo(
    current.screenX- headlen * Math.cos(angle + Math.PI / 6),
    current.screenY - headlen * Math.sin(angle + Math.PI / 6),
  );

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function renderArrow(
  ctx: CanvasRenderingContext2D,
  shape: ArrowType,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen,
) {
  const shapeOne = worldToScreen(shape.x1, shape.y1);
  const shapeTwo = worldToScreen(shape.x2, shape.y2);
  
  ctx.save();

  const headlen = 16;

  const dx = shapeTwo.screenX - shapeOne.screenX;
  const dy = shapeTwo.screenY - shapeOne.screenY;

  const angle = Math.atan2(dy, dx);

  ctx.beginPath();

  ctx.moveTo(shapeOne.screenX, shapeOne.screenY);
  ctx.lineTo(shapeTwo.screenX, shapeTwo.screenY);

  ctx.moveTo(shapeTwo.screenX, shapeTwo.screenY);
  ctx.lineTo(
    shapeTwo.screenX - headlen * Math.cos(angle - Math.PI / 6),
    shapeTwo.screenY - headlen * Math.sin(angle - Math.PI / 6),
  );

  ctx.moveTo(shapeTwo.screenX, shapeTwo.screenY);
  ctx.lineTo(
    shapeTwo.screenX - headlen * Math.cos(angle + Math.PI / 6),
    shapeTwo.screenY - headlen * Math.sin(angle + Math.PI / 6),
  );

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (selectedShapeId === shape.id) {
    ctx.beginPath();
    ctx.arc(shapeOne.screenX, shapeOne.screenY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(shapeTwo.screenX, shapeTwo.screenY, 5, 0, Math.PI * 2);
    ctx.fill();

    const midX = (shapeOne.screenX + shapeTwo.screenX) / 2;
    const midY = (shapeOne.screenY + shapeTwo.screenY) / 2;
    const len = Math.hypot(dx, dy);
    
    const nx = len === 0 ? 0 : -dy / len;
    const ny = len === 0 ? -1 : dx / len;
    
    const rotLength = 25;
    const rotX = midX + nx * rotLength;
    const rotY = midY + ny * rotLength;
    
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(rotX, rotY);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(rotX, rotY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

export function isPointOnArrow(
  ctx: CanvasRenderingContext2D,
  mouseX: number,
  mouseY: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  selectionArea = 10,
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineCap = "round";
  ctx.lineWidth = selectionArea;
  const touch = ctx.isPointInStroke(mouseX, mouseY);
  ctx.restore();
  return touch;
}

export function getArrowHandleAtPoint(
  mouseX: number,
  mouseY: number,
  shape: ArrowType,
  scale: number
): string | null {
  const hs = 10 / scale;
  
  if (Math.hypot(mouseX - shape.x1, mouseY - shape.y1) <= hs) {
    return "start";
  }
  
  if (Math.hypot(mouseX - shape.x2, mouseY - shape.y2) <= hs) {
    return "end";
  }
  
  const midX = (shape.x1 + shape.x2) / 2;
  const midY = (shape.y1 + shape.y2) / 2;
  const dx = shape.x2 - shape.x1;
  const dy = shape.y2 - shape.y1;
  const len = Math.hypot(dx, dy);
  
  const nx = len === 0 ? 0 : -dy / len;
  const ny = len === 0 ? -1 : dx / len;
  
  const rotLength = 25 / scale;
  const rotX = midX + nx * rotLength;
  const rotY = midY + ny * rotLength;
  
  if (Math.hypot(mouseX - rotX, mouseY - rotY) <= hs) {
    return "rotate";
  }
  
  return null;
}
