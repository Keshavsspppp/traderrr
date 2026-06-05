import { createAlphaVantageProvider } from "./alpha-vantage";
import { createTwelveDataProvider } from "./twelve-data";
import type { MarketDataProvider, StockQuote } from "./types";

export type { StockQuote, MarketDataProvider } from "./types";

function buildProviders(): MarketDataProvider[] {
  const preferred = (process.env.MARKET_DATA_PROVIDER ?? "auto").toLowerCase();
  const twelveKey = process.env.TWELVE_DATA_API_KEY?.trim();
  const alphaKey = process.env.ALPHA_VANTAGE_API_KEY?.trim();
  const providers: MarketDataProvider[] = [];

  const addTwelve = () => {
    if (twelveKey && !providers.some((p) => p.name === "twelvedata")) {
      providers.push(createTwelveDataProvider(twelveKey));
    }
  };
  const addAlpha = () => {
    if (alphaKey && !providers.some((p) => p.name === "alphavantage")) {
      providers.push(createAlphaVantageProvider(alphaKey));
    }
  };

  if (preferred === "twelvedata") {
    addTwelve();
    addAlpha();
  } else if (preferred === "alphavantage") {
    addAlpha();
    addTwelve();
  } else {
    addTwelve();
    addAlpha();
  }

  return providers;
}

export function getMarketDataProviders(): MarketDataProvider[] {
  return buildProviders();
}

export function getMarketDataProvider(): MarketDataProvider | null {
  return getMarketDataProviders()[0] ?? null;
}

export async function fetchQuoteWithFallback(
  symbol: string
): Promise<{ quote: StockQuote; provider: string } | null> {
  const providers = getMarketDataProviders();
  for (const provider of providers) {
    const quote = await provider.fetchQuote(symbol);
    if (quote) {
      return { quote, provider: provider.name };
    }
  }
  return null;
}

export function isLiveMarketEnabled(): boolean {
  return getMarketDataProviders().length > 0;
}
