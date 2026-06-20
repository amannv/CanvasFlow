import { Shape } from "../utils/types";
import { clearCanvas } from "../utils/clearCanvas";

export function socketMessageListener(
  socket: WebSocket,
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  selectedShapeId: number | null,
) {
  socket.onmessage = (event) => {
    const parsedMessage = JSON.parse(event.data);

    if (parsedMessage.type === "create_element") {
      existingShapes.push(parsedMessage.shape);
      clearCanvas(existingShapes, canvas, ctx, selectedShapeId);
    }

    if (parsedMessage.type === "update_element") {
      console.log("UPDATE RECEIVED");
      console.log(parsedMessage.shape);
      const index = existingShapes.findIndex(
        (shape) => shape.id === parsedMessage.elementId,
      );

      if (index !== -1) {
        existingShapes[index] = parsedMessage.shape;
      }

      clearCanvas(existingShapes, canvas, ctx, null);
    }
  };
}

export function createElementSender(
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

export function updateElementSender(
  id: number,
  socket: WebSocket,
  shape: Shape,
  roomId: string,
) {
  console.log("websocket update sent");
  socket.send(
    JSON.stringify({
      type: "update_element",
      payload: {
        elementId: id,
        data: shape,
        roomId: roomId,
      },
    }),
  );
}
