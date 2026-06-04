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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold">Market Overview</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-4 text-left">Symbol</th>
              <th className="py-4 text-left">Company</th>
              <th className="py-4 text-left">Price</th>
              <th className="py-4 text-left">Change</th>
              <th className="py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol} className="border-b border-zinc-900">
                <td className="py-4 font-medium">{stock.symbol}</td>
                <td className="py-4 text-zinc-400">{stock.companyName}</td>
                <td className="py-4">{formatCurrency(stock.price)}</td>
                <td
                  className={`py-4 ${
                    stock.changePercent >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    {onWatchlist && (
                      <button
                        type="button"
                        onClick={() => onWatchlist(stock.symbol)}
                        className="rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                      >
                        Watch
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onTrade(stock.symbol)}
                      className="rounded-xl bg-green-500 px-4 py-2 font-medium text-black"
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
