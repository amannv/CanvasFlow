export type DrawState = {
  clicked: boolean;
};

export function handleMouseDown(state: DrawState) {
  state.clicked = true;
}

export function previewCircle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
) {
  const deltaX = currentX - startX;
  const deltaY = currentY - startY;

  const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "white";
  ctx.stroke();
}

export function handleMouseUp(state: DrawState) {
  state.clicked = false;
}
