import { TextShape, WorldToScreen } from "../../utils/types";
import { rotatePoint } from "../rectangle/rectangleTool";

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
  const { screenX, screenY, scale } = worldToScreen(x, y);
  ctx.save();
  ctx.font = `${24 * scale}px Sniglet`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.fillText(text, screenX, screenY);
  ctx.restore();
}

export function renderText(
  ctx: CanvasRenderingContext2D, 
  shape: TextShape,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen
) {
  const { screenX, screenY, scale } = worldToScreen(shape.x, shape.y);

  ctx.save();
  ctx.font = `24px Sniglet`; // Use base font to measure
  const baseWidth = ctx.measureText(shape.text).width;
  const baseHeight = 24;

  const width = (shape.width ?? baseWidth) * scale;
  const height = (shape.height ?? baseHeight) * scale;
  
  const scaleX = width / (baseWidth * scale);
  const scaleY = height / (baseHeight * scale);

  const cx = screenX + width / 2;
  const cy = screenY + height / 2;

  ctx.translate(cx, cy);
  if (shape.angle) {
    ctx.rotate(shape.angle);
  }
  ctx.translate(-cx, -cy);

  // Draw text
  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.scale(scaleX, scaleY);
  ctx.font = `${24 * scale}px Sniglet`; // scale applies natively
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.fillText(shape.text, 0, 0);
  ctx.restore();

  if (selectedShapeId === shape.id) {
    const offset = 5;
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.setLineDash([5,5]);

    ctx.strokeRect(
      screenX - offset,
      screenY - offset,
      width + offset * 2,
      height + offset * 2
    );

    ctx.setLineDash([]);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    
    const hs = 10;
    const handles = [
      { x: screenX - offset, y: screenY - offset }, // nw
      { x: screenX + width + offset, y: screenY - offset }, // ne
      { x: screenX + width + offset, y: screenY + height + offset }, // se
      { x: screenX - offset, y: screenY + height + offset }, // sw
    ];

    for (const h of handles) {
      ctx.fillRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
      ctx.strokeRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
    }

    const rx = screenX + width / 2;
    const ry = screenY - offset - 25;
    ctx.beginPath();
    ctx.moveTo(rx, screenY - offset);
    ctx.lineTo(rx, ry);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rx, ry, hs / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
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
  const baseWidth = ctx.measureText(shape.text).width;
  ctx.restore();
  
  const width = shape.width ?? baseWidth;
  const height = shape.height ?? 24;

  let px = mouseX;
  let py = mouseY;
  
  if (shape.angle) {
      const cx = shape.x + width / 2;
      const cy = shape.y + height / 2;
      const rotated = rotatePoint(px, py, cx, cy, -shape.angle);
      px = rotated.x;
      py = rotated.y;
  }

  return (
    px >= shape.x &&
    px <= shape.x + width &&
    py >= shape.y &&
    py <= shape.y + height
  )
}

export function getTextHandleAtPoint(
  mouseX: number,
  mouseY: number,
  shape: TextShape,
  scale: number,
  ctx: CanvasRenderingContext2D
): string | null {
  ctx.save();
  ctx.font = "24px Sniglet";
  const baseWidth = ctx.measureText(shape.text).width;
  ctx.restore();
  
  const width = shape.width ?? baseWidth;
  const height = shape.height ?? 24;
  const cx = shape.x + width / 2;
  const cy = shape.y + height / 2;

  let px = mouseX;
  let py = mouseY;

  if (shape.angle) {
    const rotated = rotatePoint(px, py, cx, cy, -shape.angle);
    px = rotated.x;
    py = rotated.y;
  }

  const offset = 5 / scale;
  const hs = 10 / scale;

  const handles = [
    { type: "nw", x: shape.x - offset, y: shape.y - offset },
    { type: "ne", x: shape.x + width + offset, y: shape.y - offset },
    { type: "se", x: shape.x + width + offset, y: shape.y + height + offset },
    { type: "sw", x: shape.x - offset, y: shape.y + height + offset },
  ];

  for (const h of handles) {
    if (Math.abs(px - h.x) <= hs / 2 && Math.abs(py - h.y) <= hs / 2) {
      return h.type;
    }
  }

  const rx = shape.x + width / 2;
  const ry = shape.y - offset - 25 / scale;
  if (Math.hypot(px - rx, py - ry) <= hs / 2) {
    return "rotate";
  }

  return null;
}
