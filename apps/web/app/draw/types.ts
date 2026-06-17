export type RectangleShape = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CircleShape = {
  type: "circle";
  centreX: number;
  centreY: number;
  radius: number;
};

export type LineShape = {
  type: "line";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type DrawState = {
  clicked: boolean;
};

export type Shape = RectangleShape | CircleShape | LineShape;
