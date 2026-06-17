import { LineShape } from "../types";

export function createLine(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): LineShape {
  const shape: LineShape = {
    type: "line",
    startX: startX,
    startY: startY,
    endX: endX,
    endY: endY,
  };

  return shape;
}
