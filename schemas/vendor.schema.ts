import { z } from "zod";

export const createVendorSchema = z.object({
  name: z.string().min(2),
  gst_no: z.string().length(15),
  phone: z.string().optional(),
  address: z.string().optional(),
  state: z.string(),
});
