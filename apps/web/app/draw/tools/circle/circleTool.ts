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
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#000000";
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
  
  const sigRx = shape.radiusX * scale;
  const sigRy = shape.radiusY * scale;
  const rx = Math.abs(sigRx);
  const ry = Math.abs(sigRy);

  ctx.translate(screenX, screenY);
  if (shape.angle) {
    ctx.rotate(shape.angle);
  }

  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, 2 * Math.PI);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#000000";
  ctx.stroke();

  if (shape.id === selectedShapeId) {
    const offset = 8;
    const px1 = -sigRx - offset * (sigRx >= 0 ? 1 : -1);
    const px2 = sigRx + offset * (sigRx >= 0 ? 1 : -1);
    const py1 = -sigRy - offset * (sigRy >= 0 ? 1 : -1);
    const py2 = sigRy + offset * (sigRy >= 0 ? 1 : -1);

    ctx.strokeStyle = "oklch(66.9% 0.18368 248.8066)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(px1, py1, px2 - px1, py2 - py1);

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "oklch(66.9% 0.18368 248.8066)";
    
    const hs = 10; 
    const handles = [
      { x: px1, y: py1 }, 
      { x: px2, y: py1 }, 
      { x: px2, y: py2 },
      { x: px1, y: py2 },
    ];

    for (const h of handles) {
      ctx.fillRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
      ctx.strokeRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
    }


    const rtx = 0;
    const rty = Math.min(py1, py2) - 25;
    ctx.beginPath();
    ctx.moveTo(rtx, Math.min(py1, py2));
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
  const hs = 10 / scale;
  
  let px = mouseX;
  let py = mouseY;
  if (circle.angle) {
      const rotated = rotatePoint(px, py, circle.centreX, circle.centreY, -circle.angle);
      px = rotated.x;
      py = rotated.y;
  }

  const sigRx = circle.radiusX;
  const sigRy = circle.radiusY;
  const px1 = circle.centreX - sigRx - offset * (sigRx >= 0 ? 1 : -1);
  const px2 = circle.centreX + sigRx + offset * (sigRx >= 0 ? 1 : -1);
  const py1 = circle.centreY - sigRy - offset * (sigRy >= 0 ? 1 : -1);
  const py2 = circle.centreY + sigRy + offset * (sigRy >= 0 ? 1 : -1);


  const rx = circle.centreX;
  const ry = Math.min(py1, py2) - (25 / scale);
  const dist = Math.hypot(px - rx, py - ry);
  if (dist <= hs) {
    return "rotate";
  }


  const handles = [
    { id: "nw", x: px1, y: py1 },
    { id: "ne", x: px2, y: py1 },
    { id: "se", x: px2, y: py2 },
    { id: "sw", x: px1, y: py2 },
  ];

  for (const h of handles) {
    if (Math.abs(px - h.x) <= hs / 2 && Math.abs(py - h.y) <= hs / 2) {
      return h.id;
    }
  }

  return null;
}