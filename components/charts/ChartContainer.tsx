"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

interface ChartContainerProps {
  children: ReactElement;
  className?: string;
  minHeight?: number;
}

export default function ChartContainer({
  children,
  className = "",
  minHeight = 360,
}: ChartContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth > 0 && clientHeight > 0) {
        setSize({ width: clientWidth, height: clientHeight });
        // #region agent log
        fetch("http://127.0.0.1:7383/ingest/1d956aa0-745f-4a8b-8b5a-ce55cefd5f19", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "23f49e",
          },
          body: JSON.stringify({
            sessionId: "23f49e",
            runId: "chart-size",
            hypothesisId: "H1",
            location: "ChartContainer.tsx:check",
            message: "chart container measured",
            data: { clientWidth, clientHeight },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
      }
    };

    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`w-full min-w-0 ${className}`}
      style={{ minHeight, height: minHeight }}
    >
      {size ? (
        <ResponsiveContainer width={size.width} height={size.height}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div
          className="w-full animate-pulse rounded-xl bg-white/5"
          style={{ height: minHeight }}
          aria-hidden
        />
      )}
    </div>
  );
}
