"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import StockSearch from "@/components/market/StockSearch";
import StockCard from "@/components/market/StockCard";
import StockTable, { type MarketStock } from "@/components/market/StockTable";
import WatchList from "@/components/market/WatchList";
import TradeModal from "@/components/market/TradeModal";
import PageHeader from "@/components/ui/PageHeader";
import { formatCurrency } from "@/lib/format";
import { useLivePrices } from "@/hooks/useLivePrices";
import toast from "react-hot-toast";

export default function MarketView() {
  const [baseStocks, setBaseStocks] = useState<MarketStock[]>([]);
  const [search, setSearch] = useState("");
  const [tradeSymbol, setTradeSymbol] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/market");
      if (!res.ok) return;
      const data = await res.json();
      setBaseStocks(data.stocks);
      setLive(Boolean(data.live));
      setLastUpdated(data.lastUpdated ?? null);
    } catch {
      /* network / dev reload */
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  const liveStocks = useLivePrices(baseStocks);
  const stocks: MarketStock[] = useMemo(
    () =>
      liveStocks.map((s) => {
        const base = baseStocks.find((b) => b.symbol === s.symbol);
        return {
          symbol: s.symbol,
          companyName: base?.companyName ?? s.companyName ?? s.symbol,
          price: s.price,
          changePercent: s.changePercent,
        };
      }),
    [liveStocks, baseStocks]
  );

  useEffect(() => {
    if (baseStocks.length > 0) setStreaming(true);
  }, [baseStocks.length]);

  const topGainers = useMemo(
    () => [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4),
    [stocks]
  );

  const refreshAll = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/market/sync", { method: "POST" });
      if (res.ok) {
        toast.success("Market prices refreshed");
        await load();
      } else {
        const json = await res.json();
        toast.error(json.error ?? "Sync failed");
      }
    } finally {
      setSyncing(false);
    }
  };

  const filtered = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const tradeStock = stocks.find((s) => s.symbol === tradeSymbol);

  const addToWatchlist = async (symbol: string) => {
    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });
    if (res.ok) {
      toast.success(`${symbol} added to watchlist`);
      load();
    } else {
      const json = await res.json();
      toast.error(json.error ?? "Failed to add");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Market"
          description="Discover stocks, monitor top movers, and execute virtual trades."
        />
        <div className="flex flex-wrap items-center gap-3">
          {streaming && (
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Live ticks
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              live
                ? "bg-green-500/15 text-green-400"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {live ? "API data" : "Seeded data"}
          </span>
          {lastUpdated && (
            <span className="text-xs text-zinc-500">
              Synced {new Date(lastUpdated).toLocaleString("en-IN")}
            </span>
          )}
          {live && (
            <button
              type="button"
              onClick={refreshAll}
              disabled={syncing}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              {syncing ? "Syncing…" : "Refresh prices"}
            </button>
          )}
        </div>
      </div>
      <StockSearch value={search} onChange={setSearch} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topGainers.map((s) => (
          <StockCard
            key={s.symbol}
            symbol={s.symbol}
            price={formatCurrency(s.price)}
            change={`${s.changePercent >= 0 ? "+" : ""}${s.changePercent.toFixed(2)}%`}
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StockTable
            stocks={filtered}
            onTrade={setTradeSymbol}
            onWatchlist={addToWatchlist}
          />
        </div>
        <WatchList onRefresh={load} />
      </div>
      <TradeModal
        open={!!tradeSymbol}
        symbol={tradeSymbol ?? ""}
        price={tradeStock?.price ?? 0}
        onClose={() => setTradeSymbol(null)}
        onSuccess={load}
      />
    </div>
  );
}
