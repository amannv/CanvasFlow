import { RectangleShape } from "../../utils/types";

export function createRectangle(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): RectangleShape {
  const shape: RectangleShape = {
    type: "rect",
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
  };

  return shape;
}


export function previewRectangle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
) {
  const width = currentX - startX;
  const height = currentY - startY;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.strokeRect(startX, startY, width, height);
}



export function renderRectangle(
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
  selectedShapeId: number | null,
) {

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

  ctx.strokeRect(
    shape.x,
    shape.y,
    shape.width,
    shape.height
  );

  if (shape.id === selectedShapeId) {

    ctx.strokeStyle = "blue";
    ctx.setLineDash([5, 5]);

    ctx.strokeRect(
      shape.x - 5,
      shape.y - 5,
      shape.width + 10,
      shape.height + 10
    );
  }

  ctx.restore();
}


export function isPointInsideRectangle(
    mouseX: number,
    mouseY: number,
    rect: RectangleShape,
) {
    return (
        mouseX >= rect.x &&
        mouseX <= rect.x + rect.width &&
        mouseY >= rect.y &&
        mouseY <= rect.y + rect.height 
    )
}