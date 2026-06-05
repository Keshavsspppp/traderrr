import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler, AppError } from "@/lib/errors";
import { orderSchema } from "@/lib/validations/order";
import { getUserOrders, placeOrder } from "@/services/order.service";

export const GET = apiHandler(async (req) => {
  await connectDB();
  const user = await requireUser();
  const url = new URL(req.url);
  const contestId = url.searchParams.get("contestId");
  const orders = await getUserOrders(user._id.toString(), contestId);
  return NextResponse.json({ orders });
});

export const POST = apiHandler(async (req) => {
  await connectDB();
  const user = await requireUser();

  const body = await req.json();
  const parsed = orderSchema.safeParse({
    ...body,
    symbol: body.symbol?.toUpperCase?.(),
    quantity: Number(body.quantity),
    limitPrice: body.limitPrice != null ? Number(body.limitPrice) : undefined,
  });

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "Invalid order", 400);
  }

  const result = await placeOrder(user, parsed.data);
  return NextResponse.json(result);
});
