import { LineShape, WorldToScreen } from "../../utils/types";

export function createLine(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): LineShape {
  const shape: LineShape = {
    id: crypto.randomUUID(),
    type: "line",
    startX: startX,
    startY: startY,
    endX: endX,
    endY: endY,
  };

  return shape;
}


export function previewLine(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  worldToScreen: WorldToScreen,
) {
  const start = worldToScreen(startX, startY);
  const current = worldToScreen(currentX, currentY);

  ctx.beginPath();
  ctx.moveTo(start.screenX, start.screenY);
  ctx.lineTo(current.screenX, current.screenY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}




export function renderLine(
  ctx: CanvasRenderingContext2D, 
  shape: LineShape,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen,
) {
  const start = worldToScreen(shape.startX, shape.startY);
  const end = worldToScreen(shape.endX, shape.endY);

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(start.screenX, start.screenY);
  ctx.lineTo(end.screenX, end.screenY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  if (selectedShapeId === shape.id) {
    ctx.beginPath();
    ctx.arc(start.screenX, start.screenY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(end.screenX, end.screenY, 5, 0, Math.PI * 2);
    ctx.fill();

    // rotation handle
    const midX = (start.screenX + end.screenX) / 2;
    const midY = (start.screenY + end.screenY) / 2;
    const dx = end.screenX - start.screenX;
    const dy = end.screenY - start.screenY;
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

export function isPointInsideLine(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    selectionArea = 10
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

export function getLineHandleAtPoint(
  mouseX: number,
  mouseY: number,
  shape: LineShape,
  scale: number
): string | null {
  const hs = 10 / scale;
  
  if (Math.hypot(mouseX - shape.startX, mouseY - shape.startY) <= hs) {
    return "start";
  }
  
  if (Math.hypot(mouseX - shape.endX, mouseY - shape.endY) <= hs) {
    return "end";
  }
  
  const midX = (shape.startX + shape.endX) / 2;
  const midY = (shape.startY + shape.endY) / 2;
  const dx = shape.endX - shape.startX;
  const dy = shape.endY - shape.startY;
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