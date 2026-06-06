import { prisma } from "@repo/database";
import { type Request, type Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const userSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userCheck = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userCheck) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
      },
    });

    if (response) {
      return res.status(200).json({
        message: "User successfully signed up!",
      });
    }
  } catch (e) {
    console.error("Error while signing up", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userSignin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        message: "User don't exist",
      });
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);

    if (findUser && passwordMatch) {
      const token = jwt.sign({ userId: findUser.id }, JWT_SECRET as string);
      return res.status(200).json({
        token: token,
        message: "User signed in successfully",
      });
    }
  } catch (e) {
    console.error("Error while logging in", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createRoom = async (req: Request, res: Response) => {

    res.status(200).json({
        roomId: 112,
        message: "Room successfully created",
    });
};
