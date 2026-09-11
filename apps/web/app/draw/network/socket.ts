import { Shape, WorldToScreen } from "../utils/types";
import { clearCanvas } from "../utils/clearCanvas";

export function socketMessageListener(
  socket: WebSocket,
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  getSelectedShapeId: () => string | null,
  worldToScreen: WorldToScreen,
  ignoreUpdate: (id: string) => boolean = () => false,
  onCursorMove: (
    userId: number,
    name: string,
    x: number,
    y: number,
  ) => void = () => {},
  onCursorLeave: (userId: number) => void = () => {},
  onUserJoined: (userId: number, name: string) => void = () => {},
  onUserLeft: (userId: number, name: string) => void = () => {},
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

    if (parsedMessage.type === "cursor_move") {
      if (typeof parsedMessage.name !== "string") return;

      onCursorMove(
        parsedMessage.userId,
        parsedMessage.name,
        parsedMessage.x,
        parsedMessage.y,
      );
    }

    if (parsedMessage.type === "cursor_leave") {
      onCursorLeave(parsedMessage.userId);
    }

    if (parsedMessage.type === "join_room") {
      if (typeof parsedMessage.name !== "string") return;
      onUserJoined(parsedMessage.userId, parsedMessage.name);
    }

    if (parsedMessage.type === "leave_room") {
      if (typeof parsedMessage.name !== "string") return;
      onUserLeft(parsedMessage.userId, parsedMessage.name);
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
        roomId: Number(roomId),
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
        roomId: Number(roomId),
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
        roomId: Number(roomId),
      },
    }),
  );
}
