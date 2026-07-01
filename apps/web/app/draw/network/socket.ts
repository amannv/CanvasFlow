import { Shape, WorldToScreen } from "../utils/types";
import { clearCanvas } from "../utils/clearCanvas";

export function socketMessageListener(
  socket: WebSocket,
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  getSelectedShapeId: () => string | null,
  worldToScreen: WorldToScreen,
  ignoreUpdate: (id: string) => boolean = () => false
) {
  socket.onmessage = (event) => {
    if (socket.readyState !== WebSocket.OPEN) return;

    const parsedMessage = JSON.parse(event.data);
    console.log("received", parsedMessage.type);

    if (parsedMessage.type === "create_element") {
      console.log("RECEIVE", parsedMessage.shape.id, parsedMessage.shape.type);
      const exists = existingShapes.some((s) => s.id === parsedMessage.shape.id);
      if (!exists) {
        existingShapes.push(parsedMessage.shape);
        clearCanvas(
          existingShapes,
          canvas,
          ctx,
          getSelectedShapeId(),
          worldToScreen,
        );
      }
    }

    if (parsedMessage.type === "update_element") {
      const index = existingShapes.findIndex(
        (shape) => shape.id === parsedMessage.shapeId,
      );

      if (index !== -1) {
        if (!ignoreUpdate(parsedMessage.shapeId)) {
          existingShapes[index] = parsedMessage.shape;
        }
      }

      clearCanvas(
        existingShapes,
        canvas,
        ctx,
        getSelectedShapeId(),
        worldToScreen,
      );
    }

    if (parsedMessage.type === "delete_element") {
      const index = existingShapes.findIndex(
        (s) => s.id === parsedMessage.shapeId,
      );

      if (index !== -1) {
        existingShapes.splice(index, 1);
      }
      clearCanvas(
        existingShapes,
        canvas,
        ctx,
        getSelectedShapeId(),
        worldToScreen,
      );
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
