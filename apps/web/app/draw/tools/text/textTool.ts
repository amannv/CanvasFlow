import { TextShape, WorldToScreen } from "../../utils/types";

export function createText(x: number, y: number, text: string): TextShape {
  const shape: TextShape = {
    id: crypto.randomUUID(),
    type: "text",
    x: x,
    y: y,
    text: text,
  };

  return shape;
}


export function previewText(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  worldToScreen: WorldToScreen
) {
  ctx.font = `24px Sniglet`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.fillText(text, x, y);
}



export function renderText(
  ctx: CanvasRenderingContext2D, 
  shape: TextShape,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen
) {
  const { screenX, screenY, scale } = worldToScreen(shape.x, shape.y);

  ctx.save();

  ctx.font = `${24 * scale}px Sniglet`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.fillText(shape.text, screenX, screenY);

  if (selectedShapeId === shape.id) {

    const scaledWidth = ctx.measureText(shape.text).width;
    const scaledHeight = 24 * scale;

    ctx.strokeStyle = "blue";
    ctx.setLineDash([5,5]);

    ctx.strokeRect(
      screenX - 5,
      screenY - 5,
      scaledWidth + 10,
      scaledHeight + 10
    )
  }

  ctx.restore();
}



export function isPointOnText(
  ctx: CanvasRenderingContext2D,
  mouseX: number,
  mouseY: number,
  shape: TextShape,
) {
  ctx.save();
  ctx.font = "24px Sniglet";
  ctx.textBaseline = "top";

  const width = ctx.measureText(shape.text).width;
  const height = 24;

  ctx.restore();

  return (
    mouseX >= shape.x &&
    mouseX <= shape.x + width &&
    mouseY >= shape.y &&
    mouseY <= shape.y + height
  )
}
