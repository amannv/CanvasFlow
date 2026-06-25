import { ArrowType } from "../../utils/types";

export function createArrow(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
): ArrowType {
    const shape: ArrowType = {
        type: "arrow",
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
    }
    return shape;
}


export function previewArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
) {
  const headlen = 16;

  const dx = currentX - startX;
  const dy = currentY - startY;

  const angle = Math.atan2(dy, dx);

  ctx.beginPath();

  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);

  ctx.moveTo(currentX, currentY);
  ctx.lineTo(
    currentX - headlen * Math.cos(angle - Math.PI / 6),
    currentY - headlen * Math.sin(angle - Math.PI / 6),
  );

  ctx.moveTo(currentX, currentY);
  ctx.lineTo(
    currentX - headlen * Math.cos(angle + Math.PI / 6),
    currentY - headlen * Math.sin(angle + Math.PI / 6),
  );

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}


export function renderArrow(
  ctx: CanvasRenderingContext2D, 
  shape: ArrowType,
  selectedShapeId: number | null
) {

  ctx.save();

  const headlen = 16;

  const dx = shape.x2 - shape.x1;
  const dy = shape.y2 - shape.y1;

  const angle = Math.atan2(dy, dx);

  ctx.beginPath();

  ctx.moveTo(shape.x1, shape.y1);
  ctx.lineTo(shape.x2, shape.y2);

  ctx.moveTo(shape.x2, shape.y2);
  ctx.lineTo(
    shape.x2 - headlen * Math.cos(angle - Math.PI / 6),
    shape.y2 - headlen * Math.sin(angle - Math.PI / 6),
  );

  ctx.moveTo(shape.x2, shape.y2);
  ctx.lineTo(
    shape.x2 - headlen * Math.cos(angle + Math.PI / 6),
    shape.y2 - headlen * Math.sin(angle + Math.PI / 6),
  );

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (selectedShapeId === shape.id) {
    ctx.beginPath();
    ctx.arc(shape.x1, shape.y1, 5, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(shape.x2, shape.y2, 5, 0, Math.PI * 2); 
    ctx.fill();
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