import { prisma } from "@repo/database/prisma";
import { type Request, type Response } from "express";
const JWT_SECRET = process.env.JWT_SECRET;
import {
  createUserSchema,
  signinSchema,
  roomCreateSchema,
} from "@repo/zod/types";
import z, { string } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const userSignup = async (req: Request, res: Response) => {
  try {
    const requiredBody = createUserSchema.safeParse(req.body);

    if (!requiredBody.success) {
      return res.status(400).json({
        errors: z.flattenError(requiredBody.error),
      });
    }

    const { name, email, password } = requiredBody.data;

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
    const requiredBody = signinSchema.safeParse(req.body);

    if (!requiredBody.success) {
      return res.status(400).json({
        errors: z.flattenError(requiredBody.error),
      });
    }

    const { email, password } = requiredBody.data;

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
  try {
    const parsedData = roomCreateSchema.safeParse(req.body);
    const userId = req.userId;

    if (!parsedData.success) {
      return res.status(400).json({
        errors: z.flattenError(parsedData.error),
      });
    }

    const slug = parsedData.data.slug;

    const roomAlreadyExists = await prisma.room.findUnique({
      where: {
        slug: slug,
        adminId: userId,
      },
    });

    if (roomAlreadyExists) {
      return res.status(409).json({
        message: "Room already exists",
      });
    }

    const roomCreated = await prisma.room.create({
      data: {
        slug: slug,
        adminId: userId,
      },
    });

    if (roomCreated) {
      return res.status(200).json({
        roomId: roomCreated.id,
        message: "Room created successfully",
      });
    }
  } catch (e) {
    console.error("Error while creating room", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getElements = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    console.log("roomid:", req.params.roomId);
    const room = Number(roomId);

    if (!roomId) {
      return res.status(400).json({
        message: "Invalid params",
      });
    }

    const elements = await prisma.element.findMany({
      where: {
        roomId: room,
      },
      take: 50,
      orderBy: { id: "desc" },
    });

    if (!elements) {
      return res.status(200).json({
        message: "No elements present",
      });
    }

    return res.status(200).json({
      elements,
    });
  } catch (e) {
    console.error("Error while fetching elements");
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const returnRoomId = async (req: Request, res: Response) => {
  try {
  const { slug } = req.params;
  console.log("slug:", slug);

if (!slug) {
  return res.status(400).json({
    message: "Slug is required",
  });
}

  const room = await prisma.room.findUnique({
    where: {
      slug: slug as string
    },
  })

  if(!room) {
    return res.status(404).json({
      message: "Room not exists",
    });
  }

  return res.status(200).json({
    room
  });
} catch (e) {
  console.error("Error while finding room", e);
  return res.status(500).json({
    message: "Internal server error",
  });
}
}