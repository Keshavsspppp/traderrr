import type { MarketDataProvider, StockQuote } from "./types";

function parsePercent(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(String(raw).replace("%", "").trim());
  return Number.isFinite(n) ? n : null;
}

function parseGlobalQuote(symbol: string, quote: Record<string, string>): StockQuote | null {
  const price = Number(quote["05. price"]);
  const previousClose = Number(quote["08. previous close"]);
  if (!Number.isFinite(price)) return null;

  const changePercent =
    parsePercent(quote["10. change percent"]) ??
    (Number.isFinite(previousClose) && previousClose > 0
      ? ((price - previousClose) / previousClose) * 100
      : 0);

  return {
    symbol,
    price,
    previousClose: Number.isFinite(previousClose) ? previousClose : price,
    changePercent,
  };
}

export function createAlphaVantageProvider(apiKey: string): MarketDataProvider {
  const configuredSuffix = process.env.ALPHA_VANTAGE_SYMBOL_SUFFIX?.trim();

  return {
    name: "alphavantage",
    rateLimitMs: 13_000,

    async fetchQuote(symbol: string): Promise<StockQuote | null> {
      if (symbol.includes(".")) {
        return fetchAvQuote(apiKey, symbol, symbol);
      }

      const suffixes = configuredSuffix
        ? [configuredSuffix]
        : [".NSE", ".BSE", ".NS", ".BO"];

      for (const suffix of suffixes) {
        const avSymbol = `${symbol}${suffix}`;
        const quote = await fetchAvQuote(apiKey, symbol, avSymbol);
        if (quote) return quote;
      }

      return null;
    },
  };
}

async function fetchAvQuote(
  apiKey: string,
  symbol: string,
  avSymbol: string
): Promise<StockQuote | null> {
  const url = new URL("https://www.alphavantage.co/query");
  url.searchParams.set("function", "GLOBAL_QUOTE");
  url.searchParams.set("symbol", avSymbol);
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json()) as Record<string, unknown>;

  if (data.Note || data.Information) {
    return null;
  }

  const quote = data["Global Quote"] as Record<string, string> | undefined;
  if (!quote || Object.keys(quote).length === 0) {
    return null;
  }

  return parseGlobalQuote(symbol, quote);
}
