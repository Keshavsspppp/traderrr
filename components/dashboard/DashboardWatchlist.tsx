"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/format";
import { ArrowRight } from "lucide-react";

type WatchStock = {
  symbol: string;
  companyName: string;
  price: number;
  changePercent: number;
};

export default function DashboardWatchlist() {
  const [stocks, setStocks] = useState<WatchStock[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/watchlist");
    if (res.ok) {
      const data = await res.json();
      setStocks((data.stocks ?? []).slice(0, 5));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="card-panel">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Watchlist</h2>
        <Link
          href="/market"
          className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
        >
          Market <ArrowRight size={14} />
        </Link>
      </div>
      {stocks.length === 0 ? (
        <p className="text-sm text-zinc-400">
          No stocks watched yet.{" "}
          <Link href="/market" className="text-green-400 hover:underline">
            Add from market
          </Link>
        </p>
      ) : (
        <div className="space-y-2">
          {stocks.map((s) => (
            <div
              key={s.symbol}
              className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium">{s.symbol}</p>
                <p className="text-xs text-zinc-500">{s.companyName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{formatCurrency(s.price)}</p>
                <p
                  className={`text-xs ${
                    s.changePercent >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {s.changePercent >= 0 ? "+" : ""}
                  {s.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
