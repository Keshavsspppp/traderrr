import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { apiHandler } from "@/lib/errors";
import User from "@/models/User";
import Stock from "@/models/Stock";
import Transaction from "@/models/Transaction";

export const GET = apiHandler(async () => {
  await connectDB();

  const [userCount, stockCount, tradeCount] = await Promise.all([
    User.countDocuments(),
    Stock.countDocuments(),
    Transaction.countDocuments(),
  ]);

  return NextResponse.json({
    users: userCount,
    stocks: stockCount,
    trades: tradeCount,
    virtualCapital: "₹10L",
  });
});
