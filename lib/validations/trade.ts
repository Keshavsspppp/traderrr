import { z } from "zod";

export const tradeSchema = z.object({
  symbol: z.string().min(1).toUpperCase(),
  quantity: z.number().int().positive(),
  type: z.enum(["BUY", "SELL"]),
  contestId: z.string().min(1).optional(),
});

export type TradeInput = z.infer<typeof tradeSchema>;
