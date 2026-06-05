"use client";

import { formatCurrency } from "@/lib/format";

export type MarketStock = {
  symbol: string;
  companyName: string;
  price: number;
  changePercent: number;
};

interface StockTableProps {
  stocks: MarketStock[];
  onTrade: (symbol: string) => void;
  onWatchlist?: (symbol: string) => void;
}

export default function StockTable({ stocks, onTrade, onWatchlist }: StockTableProps) {
  return (
    <div className="card-panel">
      <h2 className="mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">Market Overview</h2>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="rounded-2xl border border-white/5 bg-black/20 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold">{stock.symbol}</p>
                <p className="truncate text-sm text-zinc-400">{stock.companyName}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(stock.price)}</p>
                <p
                  className={`text-sm ${
                    stock.changePercent >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              {onWatchlist && (
                <button
                  type="button"
                  onClick={() => onWatchlist(stock.symbol)}
                  className="flex-1 rounded-xl border border-white/10 py-2 text-sm hover:bg-white/5"
                >
                  Watch
                </button>
              )}
              <button
                type="button"
                onClick={() => onTrade(stock.symbol)}
                className="flex-1 rounded-xl bg-green-500 py-2 text-sm font-medium text-black"
              >
                Trade
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-3 text-left">Symbol</th>
              <th className="py-3 text-left">Company</th>
              <th className="py-3 text-left">Price</th>
              <th className="py-3 text-left">Change</th>
              <th className="py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol} className="border-b border-zinc-900">
                <td className="py-3 font-medium">{stock.symbol}</td>
                <td className="max-w-[180px] truncate py-3 text-zinc-400">{stock.companyName}</td>
                <td className="py-3">{formatCurrency(stock.price)}</td>
                <td
                  className={`py-3 ${
                    stock.changePercent >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    {onWatchlist && (
                      <button
                        type="button"
                        onClick={() => onWatchlist(stock.symbol)}
                        className="rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                      >
                        Watch
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onTrade(stock.symbol)}
                      className="rounded-xl bg-green-500 px-4 py-1.5 text-sm font-medium text-black"
                    >
                      Trade
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
