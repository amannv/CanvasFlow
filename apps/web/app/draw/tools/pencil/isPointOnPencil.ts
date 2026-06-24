import { PencilShape } from "../../utils/types";


export function isPointOnPencil(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    shape: PencilShape
) {
    if (shape.points.length < 2) return;
    
    ctx.save();
    ctx.beginPath();

    ctx.moveTo(shape.points[0]!.x, shape.points[0]!.y);

    for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i]!.x, shape.points[i]!.y);
    }

    ctx.lineWidth = 10;

    const touch = ctx.isPointInStroke(mouseX, mouseY);

    ctx.restore();

    return touch;
}