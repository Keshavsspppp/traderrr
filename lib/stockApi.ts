import { connectDB } from "@/lib/mongodb";
import Stock from "@/models/Stock";

export async function getStocks() {
  await connectDB();
  const stocks = await Stock.find().sort({ symbol: 1 });
  return stocks.map((s) => ({
    symbol: s.symbol,
    company: s.companyName,
    price: s.currentPrice,
    change: s.changePercent,
    sector: s.sector,
  }));
}
