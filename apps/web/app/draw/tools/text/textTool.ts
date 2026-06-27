import { TextShape } from "../../utils/types";

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
) {
  ctx.font = "24px Sniglet";
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.fillText(text, x, y);
}



export function renderText(
  ctx: CanvasRenderingContext2D, 
  shape: TextShape,
  selectedShapeId: string | null
) {
  ctx.save();

  ctx.font = "24px Sniglet";
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.fillText(shape.text, shape.x, shape.y);

  if (selectedShapeId === shape.id) {
    const width = ctx.measureText(shape.text).width;
    const height = 24;

    ctx.strokeStyle = "blue";
    ctx.setLineDash([5,5]);

    ctx.strokeRect(
      shape.x - 5,
      shape.y - 5,
      width + 10,
      height + 10
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
