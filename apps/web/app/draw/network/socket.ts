import { Shape } from "../utils/types";
import { clearCanvas } from "../utils/clearCanvas";

export function socketMessageListener(
  socket: WebSocket,
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  getSelectedShapeId: () => string | null,
) {
  socket.onmessage = (event) => {
    if (socket.readyState !== WebSocket.OPEN) return;

    const parsedMessage = JSON.parse(event.data);

    if (parsedMessage.type === "create_element") {
      existingShapes.push(parsedMessage.shape);
      clearCanvas(existingShapes, canvas, ctx, getSelectedShapeId());
    }

    if (parsedMessage.type === "update_element") {
      const index = existingShapes.findIndex(
        (shape) => shape.id === parsedMessage.shapeId,
      );

      if (index !== -1) {
        existingShapes[index] = parsedMessage.shape;
      }

      clearCanvas(existingShapes, canvas, ctx, null);
    }

    if (parsedMessage.type === "delete_element") {
      const index = existingShapes.findIndex(
        (s) => s.id === parsedMessage.shapeId,
      );

      if (index !== -1) {
        existingShapes.splice(index, 1);
      }
      clearCanvas(existingShapes, canvas, ctx, getSelectedShapeId());
    }
  };
}

export function createElementSender(
  socket: WebSocket,
  shape: Shape,
  roomId: string,
) {
  if (socket.readyState !== WebSocket.OPEN) return;

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
  id: string | null,
  socket: WebSocket,
  shape: Shape,
  roomId: string,
) {
  if (socket.readyState !== WebSocket.OPEN) return;

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

export function deleteElementSender(
  id: string | null,
  socket: WebSocket,
  roomId: string,
) {

  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      type: "delete_element",
      payload: {
        elementId: id,
        roomId: roomId,
      },
    }),
  );
}
