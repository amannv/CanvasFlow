import { CircleShape, WorldToScreen } from "../../utils/types";
import { rotatePoint } from "../rectangle/rectangleTool";

export function createCircle(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): CircleShape {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  const shape: CircleShape = {
    id: crypto.randomUUID(),
    type: "circle",
    centreX: startX,
    centreY: startY,
    radiusX: radius,
    radiusY: radius,
    angle: 0,
  };
  return shape;
}

export function previewCircle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  worldToScreen: WorldToScreen
) {
  const start = worldToScreen(startX, startY);
  const current = worldToScreen(currentX, currentY);

  const deltaX = current.screenX - start.screenX;
  const deltaY = current.screenY - start.screenY;

  const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  ctx.beginPath();
  ctx.arc(start.screenX, start.screenY, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

export function renderCircle(
  ctx: CanvasRenderingContext2D,
  shape: CircleShape,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen
) {
  const { screenX, screenY, scale } = worldToScreen(shape.centreX, shape.centreY);

  ctx.save();
  
  const rx = shape.radiusX * scale;
  const ry = shape.radiusY * scale;

  ctx.translate(screenX, screenY);
  if (shape.angle) {
    ctx.rotate(shape.angle);
  }

  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, 2 * Math.PI);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  if (shape.id === selectedShapeId) {
    const offset = 8;
    const boxWidth = rx * 2 + offset * 2;
    const boxHeight = ry * 2 + offset * 2;
    const bx = -rx - offset;
    const by = -ry - offset;

    ctx.strokeStyle = "blue";
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(bx, by, boxWidth, boxHeight);

    ctx.setLineDash([]);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    
    const hs = 10; // handle size
    const handles = [
      { x: bx, y: by }, // nw
      { x: bx + boxWidth, y: by }, // ne
      { x: bx + boxWidth, y: by + boxHeight }, // se
      { x: bx, y: by + boxHeight }, // sw
    ];

    for (const h of handles) {
      ctx.fillRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
      ctx.strokeRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
    }

    // Rotation handle
    const rtx = 0;
    const rty = by - 25;
    ctx.beginPath();
    ctx.moveTo(rtx, by);
    ctx.lineTo(rtx, rty);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rtx, rty, hs / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

export function isPointInsideCircle(
    mouseX: number,
    mouseY: number,
    circle: CircleShape
) {
    let px = mouseX;
    let py = mouseY;
    if (circle.angle) {
        const rotated = rotatePoint(px, py, circle.centreX, circle.centreY, -circle.angle);
        px = rotated.x;
        py = rotated.y;
    }

    const dx = px - circle.centreX;
    const dy = py - circle.centreY;
    
    if (circle.radiusX === 0 || circle.radiusY === 0) return false;
    
    return (dx * dx) / (circle.radiusX * circle.radiusX) + (dy * dy) / (circle.radiusY * circle.radiusY) <= 1;
}

export function getCircleHandleAtPoint(
  mouseX: number,
  mouseY: number,
  circle: CircleShape,
  scale: number
): string | null {
  const offset = 8 / scale;
  const hs = 10 / scale; // handle size in world
  
  let px = mouseX;
  let py = mouseY;
  if (circle.angle) {
      const rotated = rotatePoint(px, py, circle.centreX, circle.centreY, -circle.angle);
      px = rotated.x;
      py = rotated.y;
  }

  const bx = circle.centreX - circle.radiusX - offset;
  const by = circle.centreY - circle.radiusY - offset;
  const boxWidth = circle.radiusX * 2 + offset * 2;
  const boxHeight = circle.radiusY * 2 + offset * 2;

  // Check rotation handle
  const rx = circle.centreX;
  const ry = by - (25 / scale);
  const dist = Math.hypot(px - rx, py - ry);
  if (dist <= hs) {
    return "rotate";
  }

  // Check resize handles
  const handles = [
    { id: "nw", x: bx, y: by },
    { id: "ne", x: bx + boxWidth, y: by },
    { id: "se", x: bx + boxWidth, y: by + boxHeight },
    { id: "sw", x: bx, y: by + boxHeight },
  ];

  for (const h of handles) {
    if (Math.abs(px - h.x) <= hs / 2 && Math.abs(py - h.y) <= hs / 2) {
      return h.id;
    }
  }

  return null;
}