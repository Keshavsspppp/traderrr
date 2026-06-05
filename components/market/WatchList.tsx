"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/format";

type WatchStock = {
  symbol: string;
  companyName: string;
  price: number;
  changePercent: number;
};

export default function WatchList({ onRefresh }: { onRefresh?: () => void }) {
  const [stocks, setStocks] = useState<WatchStock[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/watchlist");
    if (res.ok) {
      const data = await res.json();
      setStocks(data.stocks ?? []);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (symbol: string) => {
    const res = await fetch(`/api/watchlist?symbol=${symbol}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(`Removed ${symbol}`);
      load();
      onRefresh?.();
    }
  };

  return (
    <div className="card-panel">
      <h2 className="mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">Watchlist</h2>
      {stocks.length === 0 ? (
        <p className="text-sm text-zinc-400">No stocks in watchlist yet.</p>
      ) : (
        <div className="space-y-3">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between rounded-xl bg-black/20 p-4"
            >
              <div>
                <p className="font-medium">{stock.symbol}</p>
                <p className="text-sm text-zinc-400">{formatCurrency(stock.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(stock.symbol)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
