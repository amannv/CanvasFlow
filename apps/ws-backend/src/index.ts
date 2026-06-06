import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

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

  const verified = jwt.verify(token, JWT_SECRET as string) as {
    userId: string;
  };

  if (!verified || !verified.userId) {
    socket.close();
    return;
  }

  socket.on("message", (message) => {
    socket.send("pong");
  });
});
