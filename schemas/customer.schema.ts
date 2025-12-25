import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2),
  phone: z.string(),
  gst_no: z.string().length(15).optional(),
  address: z.string().optional(),
  state: z.string(),
});
