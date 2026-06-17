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

export type Shape = RectangleShape | CircleShape;
