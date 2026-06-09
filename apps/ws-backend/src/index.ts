import { WebSocketServer, WebSocket } from "ws";
import { prisma } from "@repo/database/prisma";
import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;

const wss = new WebSocketServer({ port: 8080 });

const socketToUserId = new Map<WebSocket, number>();
const socketToRoomId = new Map<WebSocket, Set<string>>();
const roomToSockets = new Map<string, Set<WebSocket>>();

const verifiedUser = (token: string): number | null => {
  try {
    const verified = jwt.verify(token, JWT_SECRET as string) as {
      userId: number;
    };

    if (!verified || !verified.userId) {
      return null;
    }

    return verified.userId;
  } catch (e) {
    console.error("Unauthorized user!");
    return null;
  }
};

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

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message as unknown as string);

    if (parsedMessage.type === "join_room") {
      const roomId = parsedMessage.payload.roomId;

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
        id: crypto.randomUUID(),
        type: "join_room",
        roomId: roomId,
        userId: userId,
      };

      sockets?.forEach((socket) => {
        socket.send(JSON.stringify(message));
      });
    }

    if (parsedMessage.type === "leave_room") {
      const roomId = parsedMessage.payload.roomId;

      const ws = roomToSockets.get(roomId);
      ws?.delete(socket);

      const message = {
        id: crypto.randomUUID(),
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

    if (parsedMessage.type === "chat") {
      const message = parsedMessage.payload.message;
      const roomId = parsedMessage.payload.roomId;

      const sockets = roomToSockets.get(roomId);

      const sentMessage = {
        id: crypto.randomUUID(),
        type: "chat",
        userId: userId,
        message: message,
        roomId: roomId,
      };

      sockets?.forEach((socket) => {
        socket.send(JSON.stringify(sentMessage));
      });
    }
  });
});
