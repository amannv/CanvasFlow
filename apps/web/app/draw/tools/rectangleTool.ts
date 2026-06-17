export type DrawState = {
  clicked: boolean;
};

export function handleMouseDown(state: DrawState) {
  state.clicked = true;
}

export function previewRectangle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
) {
  const width = currentX - startX;
  const height = currentY - startY;

  ctx.strokeStyle = "white";
  ctx.strokeRect(startX, startY, width, height);
}

export function handleMouseUp(state: DrawState) {
    state.clicked = false;
}