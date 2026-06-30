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
  
  const width = shape.width * scale;
  const height = shape.height * scale;
  const cx = screenX + width / 2;
  const cy = screenY + height / 2;

  ctx.translate(cx, cy);
  if (shape.angle) {
    ctx.rotate(shape.angle);
  }
  ctx.translate(-cx, -cy);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

  ctx.strokeRect(
    screenX,
    screenY,
    width,
    height,
  );

  if (shape.id === selectedShapeId) {
    ctx.strokeStyle = "blue";
    ctx.setLineDash([5, 5]);

    const offset = 8;
    ctx.strokeRect(
      screenX - offset,
      screenY - offset,
      width + offset * 2,
      height + offset * 2
    );

    ctx.setLineDash([]);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    
    const hs = 10; // handle size
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

    // Rotation handle
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

export function rotatePoint(x: number, y: number, cx: number, cy: number, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const nx = (cos * (x - cx)) - (sin * (y - cy)) + cx;
  const ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
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

    return (
        px >= rect.x &&
        px <= rect.x + rect.width &&
        py >= rect.y &&
        py <= rect.y + rect.height 
    );
}

export function getRectangleHandleAtPoint(
  mouseX: number, // world
  mouseY: number, // world
  rect: RectangleShape,
  scale: number
): string | null {
  const offset = 8 / scale;
  const hs = 10 / scale; // handle size in world
  
  let px = mouseX;
  let py = mouseY;
  if (rect.angle) {
      const cx = rect.x + rect.width / 2;
      const cy = rect.y + rect.height / 2;
      const rotated = rotatePoint(px, py, cx, cy, -rect.angle);
      px = rotated.x;
      py = rotated.y;
  }

  // Check rotation handle
  const rx = rect.x + rect.width / 2;
  const ry = rect.y - offset - (25 / scale);
  const dist = Math.hypot(px - rx, py - ry);
  if (dist <= hs) {
    return "rotate";
  }

  // Check resize handles
  const handles = [
    { id: "nw", x: rect.x - offset, y: rect.y - offset },
    { id: "ne", x: rect.x + rect.width + offset, y: rect.y - offset },
    { id: "se", x: rect.x + rect.width + offset, y: rect.y + rect.height + offset },
    { id: "sw", x: rect.x - offset, y: rect.y + rect.height + offset },
  ];

  for (const h of handles) {
    if (Math.abs(px - h.x) <= hs / 2 && Math.abs(py - h.y) <= hs / 2) {
      return h.id;
    }
  }

  return null;
}