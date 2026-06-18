import { PencilShape } from "../../utils/types";

export function createPencil(
    points: {
        x: number,
        y: number,
    }[],
): PencilShape {
    const shape: PencilShape = {
        type: "pencil",
        points: [...points],
    } 
    return shape;
}