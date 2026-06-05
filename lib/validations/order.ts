import { z } from "zod";

export const orderSchema = z
  .object({
    symbol: z.string().min(1).toUpperCase(),
    quantity: z.number().int().positive(),
    type: z.enum(["BUY", "SELL"]),
    orderType: z.enum(["MARKET", "LIMIT", "STOP_LOSS"]),
    limitPrice: z.number().positive().optional(),
  })
  .refine(
    (data) =>
      data.orderType === "MARKET" ||
      (data.limitPrice != null && data.limitPrice > 0),
    { message: "Limit/stop price is required", path: ["limitPrice"] }
  );

export type OrderInput = z.infer<typeof orderSchema>;
