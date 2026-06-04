import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { tradeSchema } from "@/lib/validations/trade";
import { apiHandler, AppError } from "@/lib/errors";
import { executeTrade } from "@/services/trade.service";

export const POST = apiHandler(async (req) => {
  await connectDB();
  const user = await requireUser();

  const body = await req.json();
  const parsed = tradeSchema.safeParse({
    ...body,
    symbol: body.symbol?.toUpperCase?.(),
    quantity: Number(body.quantity),
  });

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "Invalid trade", 400);
  }

  const result = await executeTrade(user, parsed.data);
  return NextResponse.json(result);
});
