import { TextShape } from "../../utils/types";

export function createText(x: number, y: number, text: string): TextShape {
  const shape: TextShape = {
    type: "text",
    x: x,
    y: y,
    text: text,
  };

  return shape;
}
