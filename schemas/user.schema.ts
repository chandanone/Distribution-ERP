import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
  role_id: z.number(),
  is_active: z.boolean().optional(),
});

export const updateUserSchema = createUserSchema.partial();
