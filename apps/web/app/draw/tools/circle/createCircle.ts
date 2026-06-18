import { CircleShape } from "../../utils/types";

export function createCircle(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): CircleShape {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  const shape: CircleShape = {
    type: "circle",
    centreX: startX,
    centreY: startY,
    radius: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
  };
  return shape;
}
