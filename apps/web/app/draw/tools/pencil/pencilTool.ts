import { PencilShape, WorldToScreen } from "../../utils/types";
import { rotatePoint } from "../rectangle/rectangleTool";

export function createPencil(
    points: {
        x: number,
        y: number,
    }[],
): PencilShape {
    const shape: PencilShape = {
        id: crypto.randomUUID(),
        type: "pencil",
        points: [...points],
    } 
    return shape;
}

export function previewPencil(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  worldToScreen: WorldToScreen
) {
  const screenPoints = points.map(point => {
    return worldToScreen(point.x, point.y);
  })

  const firstPoint = screenPoints[0];

  if (!firstPoint) return;

  ctx.beginPath();
  ctx.moveTo(firstPoint.screenX, firstPoint.screenY);

  for (let i = 1; i < points.length; i++) {
    const point = screenPoints[i];
    if (!point) continue;
    ctx.lineTo(point.screenX, point.screenY);
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

export function renderPencil(
  ctx: CanvasRenderingContext2D,
  shape: PencilShape,
  selectedShapeId: string | null,
  worldToScreen: WorldToScreen,
) {
  const screenPoints = shape.points.map(p => worldToScreen(p.x, p.y));
  
  if (screenPoints.length === 0) return;

  const minX = Math.min(...screenPoints.map((p) => p.screenX));
  const minY = Math.min(...screenPoints.map((p) => p.screenY));
  const maxX = Math.max(...screenPoints.map((p) => p.screenX));
  const maxY = Math.max(...screenPoints.map((p) => p.screenY));

  const width = maxX - minX;
  const height = maxY - minY;
  const cx = minX + width / 2;
  const cy = minY + height / 2;

  ctx.save();
  
  ctx.translate(cx, cy);
  if (shape.angle) {
    ctx.rotate(shape.angle);
  }
  ctx.translate(-cx, -cy);

  ctx.beginPath();
  ctx.moveTo(screenPoints[0]!.screenX, screenPoints[0]!.screenY);
  for (let i = 1; i < screenPoints.length; i++) {
    ctx.lineTo(screenPoints[i]!.screenX, screenPoints[i]!.screenY);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  if (selectedShapeId === shape.id) {
    const offset = 5;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "blue";
    ctx.strokeRect(minX - offset, minY - offset, width + offset * 2, height + offset * 2);

    ctx.setLineDash([]);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    
    const hs = 10;
    const handles = [
      { x: minX - offset, y: minY - offset },
      { x: minX + width + offset, y: minY - offset },
      { x: minX + width + offset, y: minY + height + offset },
      { x: minX - offset, y: minY + height + offset },
    ];

    for (const h of handles) {
      ctx.fillRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
      ctx.strokeRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
    }

    const rx = minX + width / 2;
    const ry = minY - offset - 25;
    ctx.beginPath();
    ctx.moveTo(rx, minY - offset);
    ctx.lineTo(rx, ry);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rx, ry, hs / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

export function isPointOnPencil(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    shape: PencilShape
) {
    if (shape.points.length < 2) return false;
    
    let px = mouseX;
    let py = mouseY;

    if (shape.angle) {
      const minX = Math.min(...shape.points.map((p) => p.x));
      const minY = Math.min(...shape.points.map((p) => p.y));
      const maxX = Math.max(...shape.points.map((p) => p.x));
      const maxY = Math.max(...shape.points.map((p) => p.y));
      const cx = minX + (maxX - minX) / 2;
      const cy = minY + (maxY - minY) / 2;
      const rotated = rotatePoint(px, py, cx, cy, -shape.angle);
      px = rotated.x;
      py = rotated.y;
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(shape.points[0]!.x, shape.points[0]!.y);
    for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i]!.x, shape.points[i]!.y);
    }
    ctx.lineWidth = 10;
    const touch = ctx.isPointInStroke(px, py);
    ctx.restore();

    return touch;
}

export function getPencilHandleAtPoint(
  mouseX: number,
  mouseY: number,
  shape: PencilShape,
  scale: number
): string | null {
  const minX = Math.min(...shape.points.map((p) => p.x));
  const minY = Math.min(...shape.points.map((p) => p.y));
  const maxX = Math.max(...shape.points.map((p) => p.x));
  const maxY = Math.max(...shape.points.map((p) => p.y));
  const width = maxX - minX;
  const height = maxY - minY;
  const cx = minX + width / 2;
  const cy = minY + height / 2;

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
    { type: "nw", x: minX - offset, y: minY - offset },
    { type: "ne", x: minX + width + offset, y: minY - offset },
    { type: "se", x: minX + width + offset, y: minY + height + offset },
    { type: "sw", x: minX - offset, y: minY + height + offset },
  ];

  for (const h of handles) {
    if (Math.abs(px - h.x) <= hs / 2 && Math.abs(py - h.y) <= hs / 2) {
      return h.type;
    }
  }

  const rx = minX + width / 2;
  const ry = minY - offset - 25 / scale;
  if (Math.hypot(px - rx, py - ry) <= hs / 2) {
    return "rotate";
  }

  return null;
}