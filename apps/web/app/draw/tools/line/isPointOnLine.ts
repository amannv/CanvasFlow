

export function isPointInsideLine(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    selectionArea = 10
) {
    ctx.save();

    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.lineCap = "round";
    ctx.lineWidth = selectionArea;

    const touch = ctx.isPointInStroke(mouseX, mouseY);

    ctx.restore();

    return touch;
}