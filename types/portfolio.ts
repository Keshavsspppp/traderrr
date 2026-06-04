export interface PortfolioData {
  totalValue: number;
  cashBalance: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  dailyChange: number;
  totalReturn: number;
  roi: number;
}

export interface PortfolioHistoryPoint {
  date: string;
  value: number;
  pnl?: number;
}

export type PortfolioTimeRange = "1D" | "1W" | "1M";
