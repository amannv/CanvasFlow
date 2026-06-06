import { Router } from "express";
import { createRoom, userSignin, userSignup } from "../controllers/userController";
import userMiddleware from "../middleware/userMiddleware";
const userRouter: Router = Router();

userRouter.post("/signup", userSignup);
userRouter.post("/signin", userSignin);
userRouter.post("/room", userMiddleware, createRoom);

export default userRouter;
