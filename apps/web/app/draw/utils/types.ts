export type RectangleShape = {
  id?: number;
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CircleShape = {
  id?: number;
  type: "circle";
  centreX: number;
  centreY: number;
  radius: number;
};

export type LineShape = {
  id?: number;
  type: "line";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type TextShape = {
  id?: number;
  type: "text",
  x: number,
  y: number,
  text: string,
}

export type DrawState = {
  clicked: boolean;
};

export type PencilShape = {
  id?: number;
  type: "pencil",
  points: {
    x: number,
    y: number,
  }[];
};

export type ArrowType = {
  id?: number;
  type: "arrow",
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}

export type Shape = RectangleShape | CircleShape | LineShape | TextShape | PencilShape | ArrowType;
