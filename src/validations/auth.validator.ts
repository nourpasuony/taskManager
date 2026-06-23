import { z } from "zod";

const emailValid = z.string().trim().email("Invalid email address");
const passValid = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character");

export const  registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(40, "Username must be at most 40 characters long"),
  email: emailValid,
  password: passValid,
});

export const loginSchema = z.object({
  email: emailValid,
  password: passValid,
});



export type RegisterInputType = z.infer<typeof registerSchema>;
export type LoginInputType= z.infer<typeof loginSchema>;