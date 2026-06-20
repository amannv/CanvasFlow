import { RectangleShape } from "../../utils/types";

export function isPointInsideRectangle(
    mouseX: number,
    mouseY: number,
    rect: RectangleShape,
) {
    return (
        mouseX >= rect.x &&
        mouseX <= rect.x + rect.width &&
        mouseY >= rect.y &&
        mouseY <= rect.y + rect.height 
    )
}