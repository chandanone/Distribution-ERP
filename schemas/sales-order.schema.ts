import { z } from "zod";

export const createSalesOrderSchema = z.object({
  customer_id: z.number(),
  warehouse_id: z.number(),
  order_date: z.coerce.date(),
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
