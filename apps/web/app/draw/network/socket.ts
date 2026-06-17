import { Shape } from "../types";
import { clearCanvas } from "../render/clearCanvas";

export function socketMessageListener(
  socket: WebSocket,
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  socket.onmessage = (event) => {
    const parsedMessage = JSON.parse(event.data);

    if (parsedMessage.type === "create_element") {
      existingShapes.push(parsedMessage.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };
}

export function socketMessageSender(
  socket: WebSocket,
  shape: Shape,
  roomId: string,
) {
  socket.send(
    JSON.stringify({
      type: "create_element",
      payload: {
        shape: shape,
        roomId: roomId,
      },
    }),
  );
}
