import z, { string } from "zod";

//http--backend schemas
export const createUserSchema = z.object({
  name: z.string().trim().min(3, "Name must be atleast 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be atleast of 8 characters"),
});

export const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be atleast of 8 characters"),
});

export const roomCreateSchema = z.object({
  slug: z.string().min(3, "Slug must be atleast of 3 characters").max(20, "Slug must be less than 20 characters"),
});

//ws-backend-schemas

export const joinRoomSchema = z.object({
  type: z.literal("join_room"),
  payload: z.object({
    roomId: z.number(),
  }),
});

export const leaveRoomSchema = z.object({
  type: z.literal("leave_room"),
  payload: z.object({
    roomId: z.number(),
  }),
});

export const createElementSchema = z.object({
  type: z.literal("create_element"),
  payload: z.object({
    shape: z.any(),
    roomId: z.number(),
  }),
});

export const updateElementSchema = z.object({
  type: z.literal("update_element"),
  payload: z.object({
    elementId: z.number(),
    data: z.object(),
    roomId: z.number(),
  }),
});

export const deleteElementSchema = z.object({
  type: z.literal("delete_element"),
  payload: z.object({
    elementId: z.number(),
    roomId: z.number(),
  }),
});