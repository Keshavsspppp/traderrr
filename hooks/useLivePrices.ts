"use client";

import { useEffect, useRef, useState } from "react";

export type LiveStock = {
  symbol: string;
  price: number;
  changePercent: number;
  companyName?: string;
};

export function useLivePrices(initial: LiveStock[]) {
  const [stocks, setStocks] = useState(initial);
  const baseRef = useRef(new Map(initial.map((s) => [s.symbol, s])));

  useEffect(() => {
    baseRef.current = new Map(initial.map((s) => [s.symbol, s]));
    setStocks(initial);
  }, [initial]);

  useEffect(() => {
    const es = new EventSource("/api/market/stream");

    es.onmessage = (event) => {
      const data = JSON.parse(event.data) as {
        ticks: { symbol: string; price: number; changePercent: number }[];
      };
      setStocks((prev) => {
        const prevMap = new Map(prev.map((s) => [s.symbol, s]));
        return data.ticks.map((tick) => {
          const base = baseRef.current.get(tick.symbol) ?? prevMap.get(tick.symbol);
          return {
            symbol: tick.symbol,
            price: tick.price,
            changePercent: tick.changePercent,
            companyName: base?.companyName,
          };
        });
      });
    };

    es.onerror = () => es.close();
    return () => es.close();
  }, []);

  return stocks;
}
