import { ArrowType } from "../../utils/types";

export function createArrow(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
): ArrowType {
    const shape: ArrowType = {
        type: "arrow",
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
    }
    return shape;
}