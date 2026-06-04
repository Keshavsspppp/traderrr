export interface StockQuote {
  symbol: string;
  price: number;
  previousClose: number;
  changePercent: number;
}

export interface MarketDataProvider {
  name: string;
  rateLimitMs: number;
  fetchQuote(symbol: string): Promise<StockQuote | null>;
}
