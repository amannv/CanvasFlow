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

export type TextShape = {
  type: "text",
  x: number,
  y: number,
  text: string,
}

export type DrawState = {
  clicked: boolean;
};

export type PencilShape = {
  type: "pencil",
  points: {
    x: number,
    y: number,
  }[];
};

export type Shape = RectangleShape | CircleShape | LineShape | TextShape | PencilShape;
