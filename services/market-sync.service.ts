import { connectDB } from "@/lib/mongodb";
import {
  fetchQuoteWithFallback,
  getMarketDataProviders,
  isLiveMarketEnabled,
} from "@/lib/market-data";
import Stock from "@/models/Stock";
import { processPendingOrders } from "@/services/order.service";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function refreshMinutes(): number {
  const n = Number(process.env.MARKET_REFRESH_MINUTES ?? "15");
  return Number.isFinite(n) && n > 0 ? n : 15;
}

export async function syncMarketPrices(options?: {
  force?: boolean;
  maxSymbols?: number;
}) {
  const providers = getMarketDataProviders();
  if (providers.length === 0) {
    return {
      live: false,
      synced: 0,
      failed: 0,
      skipped: 0,
      message: "No market API key configured in .env.local",
    };
  }

  const rateLimitMs = Math.min(...providers.map((p) => p.rateLimitMs));
  const providerNames = providers.map((p) => p.name).join(", ");

  await connectDB();
  const stocks = await Stock.find().sort({ symbol: 1 });
  const staleMs = refreshMinutes() * 60 * 1000;
  const maxSymbols = options?.maxSymbols ?? stocks.length;
  const force = options?.force ?? false;

  let synced = 0;
  let failed = 0;
  let skipped = 0;
  let processed = 0;

  for (const stock of stocks) {
    if (processed >= maxSymbols) break;

    const updatedAt = stock.updatedAt?.getTime() ?? 0;
    if (!force && Date.now() - updatedAt < staleMs) {
      skipped += 1;
      continue;
    }

    processed += 1;
    const result = await fetchQuoteWithFallback(stock.symbol);

    if (!result) {
      failed += 1;
      await delay(rateLimitMs);
      continue;
    }

    const { quote } = result;
    await Stock.findOneAndUpdate(
      { symbol: stock.symbol },
      {
        currentPrice: Math.round(quote.price * 100) / 100,
        previousClose: Math.round(quote.previousClose * 100) / 100,
        changePercent: Math.round(quote.changePercent * 100) / 100,
      }
    );
    synced += 1;
    await delay(rateLimitMs);
  }

  const orderResult = await processPendingOrders();

  return {
    live: true,
    provider: providerNames,
    synced,
    failed,
    skipped,
    ordersFilled: orderResult.filled,
    message:
      synced > 0
        ? `Updated ${synced} stock price(s) via ${providerNames}`
        : "No stale symbols to refresh",
  };
}

export async function ensureFreshMarketData() {
  if (!isLiveMarketEnabled()) {
    return { live: false as const };
  }

  await connectDB();
  const oldest = await Stock.findOne().sort({ updatedAt: 1 }).select("updatedAt");
  const staleMs = refreshMinutes() * 60 * 1000;
  const isStale =
    !oldest?.updatedAt || Date.now() - oldest.updatedAt.getTime() >= staleMs;

  if (!isStale) {
    return { live: true as const, refreshed: false };
  }

  const batchSize = Number(process.env.MARKET_SYNC_BATCH_SIZE ?? "4");
  const result = await syncMarketPrices({
    maxSymbols: Number.isFinite(batchSize) ? batchSize : 4,
  });

  return { refreshed: true, ...result, live: true as const };
}
