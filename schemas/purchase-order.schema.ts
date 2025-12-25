import { z } from "zod";

export const createPurchaseOrderSchema = z.object({
  vendor_id: z.number(),
  warehouse_id: z.number(),
  order_date: z.coerce.date(),
  remarks: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.number(),
        quantity: z.number().positive(),
        rate: z.number().positive(),
      })
    )
    .min(1),
});
