import { z } from "zod";

export const createPaymentSchema = z.object({
  invoice_id: z.number(),
  amount: z.number().positive(),
  mode: z.enum(["CASH", "BANK", "UPI", "CHEQUE"]),
  payment_date: z.coerce.date(),
  reference_no: z.string().optional(),
});
