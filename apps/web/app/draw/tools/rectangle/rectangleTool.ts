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
    angle: 0,
  };

  return shape;
}

export function previewRectangle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  worldToScreen: WorldToScreen,
) {
  const start = worldToScreen(startX, startY);
  const current = worldToScreen(currentX, currentY);

  const width = current.screenX - start.screenX;
  const height = current.screenY - start.screenY;

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#000000";
  ctx.strokeRect(start.screenX, start.screenY, width, height);
}

export function renderRectangle(
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen,
) {
  const { screenX, screenY, scale } = worldToScreen(shape.x, shape.y);

  ctx.save();

  const width = shape.width * scale;
  const height = shape.height * scale;
  const cx = screenX + width / 2;
  const cy = screenY + height / 2;

  ctx.translate(cx, cy);
  if (shape.angle) {
    ctx.rotate(shape.angle);
  }
  ctx.translate(-cx, -cy);

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#000000";

  ctx.strokeRect(screenX, screenY, width, height);

  if (shape.id === selectedShapeId) {
    ctx.strokeStyle = "oklch(66.9% 0.18368 248.8066)";
    ctx.lineWidth = 2.5;

    const offset = 8;
    const signW = Math.sign(width) || 1;
    const signH = Math.sign(height) || 1;

    const x1 = screenX - offset * signW;
    const x2 = screenX + width + offset * signW;
    const y1 = screenY - offset * signH;
    const y2 = screenY + height + offset * signH;

    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "oklch(66.9% 0.18368 248.8066)";

    const hs = 10;
    const handles = [
      { x: x1, y: y1 }, 
      { x: x2, y: y1 }, 
      { x: x2, y: y2 },
      { x: x1, y: y2 },
    ];

    for (const h of handles) {
      ctx.fillRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
      ctx.strokeRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
    }

    const rx = screenX + width / 2;
    const topY = Math.min(screenY, screenY + height);
    const ry = topY - offset - 25;
    ctx.beginPath();
    ctx.moveTo(rx, topY - offset);
    ctx.lineTo(rx, ry);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rx, ry, hs / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

export function rotatePoint(
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number,
) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const nx = cos * (x - cx) - sin * (y - cy) + cx;
  const ny = sin * (x - cx) + cos * (y - cy) + cy;
  return { x: nx, y: ny };
}

export function isPointInsideRectangle(
  mouseX: number,
  mouseY: number,
  rect: RectangleShape,
) {
  let px = mouseX;
  let py = mouseY;
  if (rect.angle) {
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const rotated = rotatePoint(px, py, cx, cy, -rect.angle);
    px = rotated.x;
    py = rotated.y;
  }

  const minX = Math.min(rect.x, rect.x + rect.width);
  const maxX = Math.max(rect.x, rect.x + rect.width);
  const minY = Math.min(rect.y, rect.y + rect.height);
  const maxY = Math.max(rect.y, rect.y + rect.height);

  return px >= minX && px <= maxX && py >= minY && py <= maxY;
}

export function getRectangleHandleAtPoint(
  mouseX: number,
  mouseY: number, 
  rect: RectangleShape,
  scale: number,
): string | null {
  const offset = 8 / scale;
  const hs = 10 / scale; 

  let px = mouseX;
  let py = mouseY;
  if (rect.angle) {
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const rotated = rotatePoint(px, py, cx, cy, -rect.angle);
    px = rotated.x;
    py = rotated.y;
  }


  const rx = rect.x + rect.width / 2;
  const topY = Math.min(rect.y, rect.y + rect.height);
  const ry = topY - offset - (25 / scale);
  const dist = Math.hypot(px - rx, py - ry);
  if (dist <= hs) {
    return "rotate";
  }


  const signW = Math.sign(rect.width) || 1;
  const signH = Math.sign(rect.height) || 1;
  
  const x1 = rect.x - offset * signW;
  const x2 = rect.x + rect.width + offset * signW;
  const y1 = rect.y - offset * signH;
  const y2 = rect.y + rect.height + offset * signH;

  const handles = [
    { id: "nw", x: x1, y: y1 },
    { id: "ne", x: x2, y: y1 },
    { id: "se", x: x2, y: y2 },
    { id: "sw", x: x1, y: y2 },
  ];

  for (const h of handles) {
    if (Math.abs(px - h.x) <= hs / 2 && Math.abs(py - h.y) <= hs / 2) {
      return h.id;
    }
  }

  return null;
}
