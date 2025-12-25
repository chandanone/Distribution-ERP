import { z } from "zod";

export const createWarehouseSchema = z.object({
  name: z.string().min(2),
  location: z.string(),
  state: z.string(),
});
