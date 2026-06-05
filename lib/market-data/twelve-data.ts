import type { MarketDataProvider, StockQuote } from "./types";

function parseNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function parseQuotePayload(
  symbol: string,
  data: Record<string, unknown>
): StockQuote | null {
  if (data.status === "error") return null;

  const price =
    parseNumber(data.close) ??
    parseNumber(data.price) ??
    parseNumber(data.last);
  const previousClose =
    parseNumber(data.previous_close) ?? parseNumber(data.prev_close);

  if (price == null) return null;

  let changePercent = parseNumber(data.percent_change);
  if (changePercent == null && previousClose != null && previousClose > 0) {
    changePercent = ((price - previousClose) / previousClose) * 100;
  }

  return {
    symbol,
    price,
    previousClose: previousClose ?? price,
    changePercent: changePercent ?? 0,
  };
}

export function createTwelveDataProvider(apiKey: string): MarketDataProvider {
  const exchange = process.env.MARKET_EXCHANGE ?? "NSE";

  return {
    name: "twelvedata",
    rateLimitMs: 8_000,

    async fetchQuote(symbol: string): Promise<StockQuote | null> {
      const attempts = [
        { symbol, exchange },
        { symbol: `${symbol}:${exchange}`, exchange: undefined },
      ];

      for (const attempt of attempts) {
        const url = new URL("https://api.twelvedata.com/quote");
        url.searchParams.set("symbol", attempt.symbol);
        if (attempt.exchange) {
          url.searchParams.set("exchange", attempt.exchange);
        }
        url.searchParams.set("apikey", apiKey);

        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) continue;

        const data = (await res.json()) as Record<string, unknown>;
        const quote = parseQuotePayload(symbol, data);
        if (quote) return quote;
      }

      return null;
    },
  };
}
