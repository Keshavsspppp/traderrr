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
