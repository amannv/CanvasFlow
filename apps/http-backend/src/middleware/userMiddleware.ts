import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;
import { type Request, type Response, type NextFunction } from "express";

const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(400).json({
        message: "Invalid header!",
      });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "User not signed in",
      });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({
        message: "JWT Doesn't exists",
      });
    }

    const userVerified = jwt.verify(token, JWT_SECRET) as {
      userId: number;
    };

    if (userVerified) {
      req.userId = userVerified.userId;
      next();
    } else {
      return res.status(401).json({
        message: "User unauthorized",
      });
    }
  } catch (e) {
    console.error("Error while authenticating user", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default userMiddleware;
