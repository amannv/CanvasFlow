import { Router } from "express";
import {
  createRoom,
  getElements,
  returnRoomId,
  userSignin,
  userSignup,
  getRooms,
  deleteRoom,
} from "../controllers/userController";
import userMiddleware from "../middleware/userMiddleware";
const userRouter: Router = Router();

userRouter.post("/signup", userSignup);
userRouter.post("/signin", userSignin);
userRouter.post("/room", userMiddleware, createRoom);
userRouter.get("/elements/:roomId", getElements);
userRouter.get("/room/:slug", returnRoomId);
userRouter.get("/rooms", userMiddleware, getRooms);
userRouter.delete("/room/delete", userMiddleware, deleteRoom);

export default userRouter;
