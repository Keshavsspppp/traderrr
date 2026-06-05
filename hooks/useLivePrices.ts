"use client";

import { useEffect, useRef, useState } from "react";

export type LiveStock = {
  symbol: string;
  price: number;
  changePercent: number;
  companyName?: string;
};

export type LivePricesStreamState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "closed";

export type LivePricesStreamStatus = {
  state: LivePricesStreamState;
  attempt: number;
};

export function useLivePrices(initial: LiveStock[]) {
  const [stocks, setStocks] = useState(initial);
  const baseRef = useRef(new Map(initial.map((s) => [s.symbol, s])));
  const [stream, setStream] = useState<LivePricesStreamStatus>({
    state: "connecting",
    attempt: 0,
  });
  const esRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedRef = useRef(false);
  const attemptRef = useRef(0);

  useEffect(() => {
    baseRef.current = new Map(initial.map((s) => [s.symbol, s]));
    setStocks(initial);
  }, [initial]);

  useEffect(() => {
    closedRef.current = false;

    const clearRetryTimer = () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };

    const closeEventSource = () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };

    const scheduleReconnect = () => {
      const baseDelay = Math.min(30_000, 1_000 * 2 ** (attemptRef.current - 1));
      const jitter = Math.floor(Math.random() * 250);
      const delay = baseDelay + jitter;

      clearRetryTimer();
      retryTimeoutRef.current = setTimeout(() => {
        if (closedRef.current) return;
        connect();
      }, delay);
    };

    const connect = () => {
      closeEventSource();
      clearRetryTimer();

      setStream((prev) => ({
        state: attemptRef.current > 0 ? "reconnecting" : "connecting",
        attempt: prev.attempt,
      }));

      const es = new EventSource("/api/market/stream");
      esRef.current = es;

      es.onopen = () => {
        attemptRef.current = 0;
        setStream({ state: "connected", attempt: 0 });
      };

      es.onmessage = (event) => {
        const data = JSON.parse(event.data) as {
          ticks: { symbol: string; price: number; changePercent: number }[];
        };
        setStocks((prev) => {
          const prevMap = new Map(prev.map((s) => [s.symbol, s]));
          return data.ticks.map((tick) => {
            const base =
              baseRef.current.get(tick.symbol) ?? prevMap.get(tick.symbol);
            return {
              symbol: tick.symbol,
              price: tick.price,
              changePercent: tick.changePercent,
              companyName: base?.companyName,
            };
          });
        });
      };

      es.onerror = () => {
        closeEventSource();
        if (closedRef.current) return;
        attemptRef.current += 1;
        setStream({ state: "reconnecting", attempt: attemptRef.current });
        scheduleReconnect();
      };
    };

    connect();

    return () => {
      closedRef.current = true;
      setStream((prev) => ({ ...prev, state: "closed" }));
      clearRetryTimer();
      closeEventSource();
    };
  }, []);

  return { stocks, stream };
}
