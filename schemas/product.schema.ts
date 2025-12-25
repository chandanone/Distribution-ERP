import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  model: z.string().min(2),
  hp: z.number(),
  phase: z.enum(["SINGLE", "THREE"]),
  price: z.number().positive(),
  gst_percent: z.number().min(0).max(28),
});
