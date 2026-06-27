export type BaseShape = {
  id: string;
};

export type RectangleShape = BaseShape & {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CircleShape = BaseShape & {
  type: "circle";
  centreX: number;
  centreY: number;
  radius: number;
};

export type LineShape = BaseShape & {
  type: "line";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type TextShape = BaseShape & {
  type: "text";
  x: number;
  y: number;
  text: string;
};

export type DrawState = {
  clicked: boolean;
};

export type PencilShape = BaseShape & {
  type: "pencil";
  points: {
    x: number;
    y: number;
  }[];
};

export type ArrowType = BaseShape & {
  type: "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type ShapeType =
  | "rectangle"
  | "line"
  | "pencil"
  | "text"
  | "arrow"
  | "pointer"
  | "circle"
  | "move"
  | "none";

export type HistoryAction =
  | {
      type: "CREATE";
      shape: Shape;
    }
  | {
      type: "DELETE";
      shape: Shape;
    }
  | {
      type: "MOVE";
      shapeId: string;
      oldProps: Shape;
      newProps: Shape;
    };

export type Shape =
  | RectangleShape
  | CircleShape
  | LineShape
  | TextShape
  | PencilShape
  | ArrowType;
