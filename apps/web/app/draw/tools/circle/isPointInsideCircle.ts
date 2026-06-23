import { CircleShape } from "../../utils/types"

export function isPointInsideCircle(
    mouseX: number,
    mouseY: number,
    circle: CircleShape
) {
    const dx = mouseX - circle.centreX;
    const dy = mouseY - circle.centreY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;

}