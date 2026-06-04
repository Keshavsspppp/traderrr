import { createAlphaVantageProvider } from "./alpha-vantage";
import { createTwelveDataProvider } from "./twelve-data";
import type { MarketDataProvider } from "./types";

export type { StockQuote, MarketDataProvider } from "./types";

export function getMarketDataProvider(): MarketDataProvider | null {
  const preferred = (process.env.MARKET_DATA_PROVIDER ?? "auto").toLowerCase();
  const twelveKey = process.env.TWELVE_DATA_API_KEY;
  const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (preferred === "twelvedata" && twelveKey) {
    return createTwelveDataProvider(twelveKey);
  }
  if (preferred === "alphavantage" && alphaKey) {
    return createAlphaVantageProvider(alphaKey);
  }

  if (preferred === "auto" || preferred === "twelvedata") {
    if (twelveKey) return createTwelveDataProvider(twelveKey);
    if (alphaKey) return createAlphaVantageProvider(alphaKey);
  }

  if (preferred === "alphavantage" && alphaKey) {
    return createAlphaVantageProvider(alphaKey);
  }

  return null;
}

export function isLiveMarketEnabled(): boolean {
  return getMarketDataProvider() != null;
}
