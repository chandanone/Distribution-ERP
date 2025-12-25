import { z } from "zod";

export const createGRNSchema = z.object({
  po_id: z.number(),
  vendor_id: z.number(),
  warehouse_id: z.number(),
  received_date: z.coerce.date(),
  items: z
    .array(
      z.object({
        product_id: z.number(),
        quantity_received: z.number().positive(),
      })
    )
    .min(1),
});
