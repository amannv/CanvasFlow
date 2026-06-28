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
  const screen = worldToScreen(shape.x, shape.y);

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

  ctx.strokeRect(
    screen.screenX,
    screen.screenY,
    shape.width,
    shape.height
  );

  if (shape.id === selectedShapeId) {

    ctx.strokeStyle = "blue";
    ctx.setLineDash([5, 5]);

    ctx.strokeRect(
      screen.screenX - 5,
      screen.screenY - 5,
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