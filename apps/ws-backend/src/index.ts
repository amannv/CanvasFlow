import "dotenv/config";
import { WebSocketServer, WebSocket } from "ws";
import { verifiedUser } from "./helpers/verifyUser";
import { prisma } from "@repo/database/prisma";
import {
  createElementSchema,
  deleteElementSchema,
  joinRoomSchema,
  leaveRoomSchema,
  updateElementSchema,
} from "@repo/zod/types";
import { safeParseJson } from "./helpers/safeParseJson";

const wss = new WebSocketServer({ port: 8080 });

const socketToUserId = new Map<WebSocket, number>();
const socketToRoomId = new Map<WebSocket, Set<number>>();
const roomToSockets = new Map<number, Set<WebSocket>>();

wss.on("connection", (socket, request) => {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");

  if (!token) {
    return;
  }

  const userId = verifiedUser(token);

  if (userId == null) {
    socket.close();
    return;
  }

  socketToUserId.set(socket, userId);

  socket.on("message", async (message) => {
    const parsedMessage = safeParseJson(message as unknown as string);

    if (!parsedMessage) {
      return;
    }

    if (parsedMessage.type === "join_room") {
      const result = joinRoomSchema.safeParse(parsedMessage);

      if (!result.success) {
        return;
      }

      const roomId = result.data.payload.roomId;

      if (!socketToRoomId.has(socket)) {
        socketToRoomId.set(socket, new Set());
      }

      const rooms = socketToRoomId.get(socket);

      rooms?.add(roomId);

      if (!roomToSockets.has(roomId)) {
        roomToSockets.set(roomId, new Set());
      }

      const sockets = roomToSockets.get(roomId);

      sockets?.add(socket);

      const message = {
        messageId: crypto.randomUUID(),
        type: "join_room",
        roomId: roomId,
        userId: userId,
      };

      sockets?.forEach((socket) => {
        socket.send(JSON.stringify(message));
      });
    }

    if (parsedMessage.type === "leave_room") {
      const result = leaveRoomSchema.safeParse(parsedMessage);

      if (!result.success) {
        return;
      }

      const roomId = result.data.payload.roomId;

      const ws = roomToSockets.get(roomId);
      ws?.delete(socket);

      const message = {
        messageId: crypto.randomUUID(),
        type: "leave_room",
        userId: userId,
        roomId: roomId,
      };

      if (ws?.size === 0) {
        roomToSockets.delete(roomId);
      } else {
        ws?.forEach((socket) => {
          socket.send(JSON.stringify(message));
        });
      }

      const sockets = socketToRoomId.get(socket);
      sockets?.delete(roomId);

      if (sockets?.size === 0) {
        socketToRoomId.delete(socket);
      }
    }

  
    if (parsedMessage.type === "create_element") {
      const result = createElementSchema.safeParse(parsedMessage);

      if (!result.success) {
        return;
      }

      const shape = result.data.payload.shape;
      const roomId = result.data.payload.roomId;

      const roomExist = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
      });

      if (!roomExist) {
        console.error("Room doesn't exists!");
        return;
      }

      const rooms = socketToRoomId.get(socket);
      if (!rooms?.has(roomId)) {
        console.error("This user has not joined this room");
        return;
      }

      const sockets = roomToSockets.get(roomId);

      const shapeCreated = await prisma.element.create({
        data: {
          roomId: roomId,
          userId: userId,
          data: shape,
        },
      });


      const sentMessage = {
        messageId: crypto.randomUUID(),
        elementId: shapeCreated.id,
        type: "create_element",
        userId: shapeCreated.userId,
        shape: shapeCreated.data,
        roomId: shapeCreated.roomId,
      };

      sockets?.forEach((socket) => {
        socket.send(JSON.stringify(sentMessage));
      });
    }

    if (parsedMessage.type === "update_element") {
      const result = updateElementSchema.safeParse(parsedMessage);

      if (!result.success) {
        return;
      }

      const elementId = result.data.payload.elementId;
      const data = result.data.payload.data;
      const roomId = result.data.payload.roomId;

      const sockets = roomToSockets.get(roomId);
      if (!sockets?.has(socket)) {
        console.error("User doesn't belongs to the room!");
        return;
      }

      const elementExist = await prisma.element.findUnique({
        where: {
          id: elementId,
        },
      });

      if (!elementExist || elementExist.roomId !== roomId) {
        console.error("Element doesn't exist in this room!");
        return;
      }

      const updateElement = await prisma.element.update({
        where: {
          id: elementId,
        },
        data: {
          data: data,
        },
      });

      if (!updateElement) {
        console.error("Error while updating element!");
        return;
      }

      const sentMessage = {
        messageId: crypto.randomUUID(),
        elementId: updateElement.id,
        type: "update_element",
        shape: updateElement.data,
        roomId: updateElement.roomId,
        userId: updateElement.userId,
      };

      sockets.forEach((socket) => {
        socket.send(JSON.stringify(sentMessage));
      });
    }

    if (parsedMessage.type === "delete_element") {
      const result = deleteElementSchema.safeParse(parsedMessage);

      if (!result.success) {
        return;
      }

      const elementId = result.data.payload.elementId;
      const roomId = result.data.payload.roomId;

      const sockets = roomToSockets.get(roomId);
      if (!sockets?.has(socket)) {
        console.error("User doesn't belongs to the room!");
        return;
      }

      const elementExist = await prisma.element.findUnique({
        where: {
          id: elementId,
        },
      });

      if (!elementExist || elementExist.roomId !== roomId) {
        console.error("Element doesn't exist in this room!");
        return;
      }

      const deleteElement = await prisma.element.delete({
        where: {
          id: elementId,
        },
      });

      if (!deleteElement) {
        console.error("Error while deleting element!");
        return;
      }

      const sentMessage = {
        messageId: crypto.randomUUID(),
        elementId: deleteElement.id,
        type: "delete_element",
        message: "Element successfully deleted",
      };

      sockets.forEach((socket) => {
        socket.send(JSON.stringify(sentMessage));
      });
    }
  });

  socket.on("close", () => {
    const rooms = socketToRoomId.get(socket);

    rooms?.forEach((room) => {
      const sockets = roomToSockets.get(room);
      sockets?.delete(socket);

      if (sockets?.size === 0) {
        roomToSockets.delete(room);
      }
    });

    socketToRoomId.delete(socket);
    socketToUserId.delete(socket);
  });
});
