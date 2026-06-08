import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;

const wss = new WebSocketServer({ port: 8080 });

const verifiedUser = (token: string): number | null => {
  const verified = jwt.verify(token, JWT_SECRET as string) as {
    userId: number;
  };

  if (!verified || !verified.userId) {
    return null;
  }

  return verified.userId;
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

  if (!userId) {
    socket.close();
  }

  socket.on("message", (message) => {
    socket.send("pong");
  });
});
