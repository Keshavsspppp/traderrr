import { z } from "zod";

export const tradeSchema = z.object({
  symbol: z.string().min(1).toUpperCase(),
  quantity: z.number().int().positive(),
  type: z.enum(["BUY", "SELL"]),
});

export type TradeInput = z.infer<typeof tradeSchema>;
