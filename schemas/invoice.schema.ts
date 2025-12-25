import { z } from "zod";

export const createInvoiceSchema = z.object({
  so_id: z.number(),
  customer_id: z.number(),
  warehouse_id: z.number(),
  invoice_date: z.coerce.date(),
  transport_id: z.number().optional(),
  items: z
    .array(
      z.object({
        product_id: z.number(),
        quantity: z.number().positive(),
        rate: z.number().positive(),
        gst_percent: z.number().min(0).max(28),
      })
    )
    .min(1),
});
