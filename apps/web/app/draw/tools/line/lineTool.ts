import { LineShape } from "../../utils/types";

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
) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}




export function renderLine(
  ctx: CanvasRenderingContext2D, 
  shape: LineShape,
  selectedShapeId: string | null,
) {

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(shape.startX, shape.startY);
  ctx.lineTo(shape.endX, shape.endY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  if (selectedShapeId === shape.id) {
  ctx.beginPath();
  ctx.arc(shape.startX, shape.startY, 5, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(shape.endX, shape.endY, 5, 0, Math.PI * 2);
  ctx.fill();
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