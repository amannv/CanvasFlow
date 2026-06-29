import { RectangleShape, WorldToScreen } from "../../utils/types";

export function createRectangle(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): RectangleShape {
  const shape: RectangleShape = {
    id: crypto.randomUUID(),
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
  worldToScreen: WorldToScreen
) {
  const start = worldToScreen(startX, startY);
  const current = worldToScreen(currentX, currentY);

  const width = current.screenX - start.screenX;
  const height = current.screenY - start.screenY;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.strokeRect(start.screenX, start.screenY, width, height);
}



export function renderRectangle(
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen
) {
  const { screenX, screenY, scale }  = worldToScreen(shape.x, shape.y);

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

  ctx.strokeRect(
    screenX,
    screenY,
    shape.width * scale,
    shape.height * scale,
  );

  if (shape.id === selectedShapeId) {

    ctx.strokeStyle = "blue";
    ctx.setLineDash([5, 5]);

    ctx.strokeRect(
      screenX - 5,
      screenY - 5,
      (shape.width * scale) + 10,
      (shape.height * scale) + 10
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