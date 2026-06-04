import type { MarketDataProvider, StockQuote } from "./types";

function parsePercent(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(String(raw).replace("%", "").trim());
  return Number.isFinite(n) ? n : null;
}

export function createAlphaVantageProvider(apiKey: string): MarketDataProvider {
  const suffix = process.env.ALPHA_VANTAGE_SYMBOL_SUFFIX ?? ".BSE";

  return {
    name: "alphavantage",
    rateLimitMs: 13_000,

    async fetchQuote(symbol: string): Promise<StockQuote | null> {
      const avSymbol = symbol.includes(".") ? symbol : `${symbol}${suffix}`;
      const url = new URL("https://www.alphavantage.co/query");
      url.searchParams.set("function", "GLOBAL_QUOTE");
      url.searchParams.set("symbol", avSymbol);
      url.searchParams.set("apikey", apiKey);

      const res = await fetch(url.toString(), { next: { revalidate: 0 } });
      if (!res.ok) return null;

      const data = (await res.json()) as Record<string, unknown>;
      const quote = data["Global Quote"] as Record<string, string> | undefined;
      if (!quote || Object.keys(quote).length === 0) {
        return null;
      }

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
    },
  };
}
