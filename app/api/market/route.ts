import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { getMarketDataProviders, isLiveMarketEnabled } from "@/lib/market-data";
import Stock from "@/models/Stock";
import { ensureFreshMarketData } from "@/services/market-sync.service";

export const GET = apiHandler(async () => {
  await connectDB();
  await requireUser();

  const syncMeta = await ensureFreshMarketData();

  const stocks = await Stock.find().sort({ symbol: 1 });

  const mapped = stocks.map((s) => ({
    symbol: s.symbol,
    companyName: s.companyName,
    sector: s.sector,
    price: s.currentPrice,
    changePercent: s.changePercent,
    marketCap: s.marketCap,
  }));

  const sorted = [...mapped].sort(
    (a, b) => b.changePercent - a.changePercent
  );

  const lastUpdated = stocks.reduce<Date | null>((latest, s) => {
    const t = s.updatedAt;
    if (!t) return latest;
    return !latest || t > latest ? t : latest;
  }, null);

  return NextResponse.json({
    stocks: mapped,
    topGainers: sorted.slice(0, 4),
    topLosers: [...mapped].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4),
    live: isLiveMarketEnabled(),
    providers: getMarketDataProviders().map((p) => p.name),
    lastUpdated: lastUpdated?.toISOString() ?? null,
    sync: syncMeta,
  });
});
