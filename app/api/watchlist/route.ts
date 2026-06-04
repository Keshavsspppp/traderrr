import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler, AppError } from "@/lib/errors";
import Watchlist from "@/models/Watchlist";
import Stock from "@/models/Stock";
import { z } from "zod";

const watchlistSchema = z.object({
  symbol: z.string().min(1),
});

export const GET = apiHandler(async () => {
  await connectDB();
  const user = await requireUser();

  let watchlist = await Watchlist.findOne({ userId: user._id });
  if (!watchlist) {
    watchlist = await Watchlist.create({ userId: user._id, stocks: [] });
  }

  const stocks = await Stock.find({ symbol: { $in: watchlist.stocks } });

  return NextResponse.json({
    symbols: watchlist.stocks,
    stocks: stocks.map((s) => ({
      symbol: s.symbol,
      companyName: s.companyName,
      price: s.currentPrice,
      changePercent: s.changePercent,
    })),
  });
});

export const POST = apiHandler(async (req) => {
  await connectDB();
  const user = await requireUser();
  const body = await req.json();
  const parsed = watchlistSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError("Invalid symbol", 400);
  }

  const symbol = parsed.data.symbol.toUpperCase();
  const stock = await Stock.findOne({ symbol });
  if (!stock) {
    throw new AppError("Stock not found", 404);
  }

  let watchlist = await Watchlist.findOne({ userId: user._id });
  if (!watchlist) {
    watchlist = await Watchlist.create({ userId: user._id, stocks: [symbol] });
  } else if (!watchlist.stocks.includes(symbol)) {
    watchlist.stocks.push(symbol);
    await watchlist.save();
  }

  return NextResponse.json({ symbols: watchlist.stocks });
});

export const DELETE = apiHandler(async (req) => {
  await connectDB();
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol")?.toUpperCase();
  if (!symbol) {
    throw new AppError("Symbol required", 400);
  }

  const watchlist = await Watchlist.findOne({ userId: user._id });
  if (watchlist) {
    watchlist.stocks = watchlist.stocks.filter((s: string) => s !== symbol);
    await watchlist.save();
  }

  return NextResponse.json({ symbols: watchlist?.stocks ?? [] });
});
