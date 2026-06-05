/** Small random walk on top of DB price for a live-market feel between API syncs. */
export function applyPriceJitter(basePrice: number, symbol: string): number {
  const seed = symbol.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const t = Date.now() / 3000;
  const wave = Math.sin(t + seed) * 0.0015;
  const noise = (Math.random() - 0.5) * 0.002;
  const delta = wave + noise;
  return Math.round(basePrice * (1 + delta) * 100) / 100;
}

export type PriceTick = {
  symbol: string;
  price: number;
  changePercent: number;
};
