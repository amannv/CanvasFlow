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
