import { RectangleShape } from "../types";

export function createRectangle(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): RectangleShape {
  const shape: RectangleShape = {
    type: "rect",
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
  };

  return shape;
}