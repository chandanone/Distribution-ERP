import { z } from "zod";

export const inventoryMovementSchema = z.object({
  product_id: z.number(),
  warehouse_id: z.number(),
  qty_change: z.number(),
  ref_type: z.enum(["GRN", "INVOICE", "ADJUSTMENT"]),
  ref_id: z.number(),
});
