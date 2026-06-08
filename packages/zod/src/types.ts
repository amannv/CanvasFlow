import z from "zod";

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