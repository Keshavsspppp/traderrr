"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartContainer from "@/components/charts/ChartContainer";

type ChartPoint = { label: string; value: number };

interface PortfolioGrowthChartProps {
  chartData?: ChartPoint[];
}

export default function PortfolioGrowthChart({
  chartData = [],
}: PortfolioGrowthChartProps) {
  const [range, setRange] = useState<"1D" | "1W" | "1M">("1M");
  const ranges = ["1D", "1W", "1M"] as const;

  const data = useMemo(() => {
    if (chartData.length === 0) {
      return [{ label: "Start", value: 1_000_000 }];
    }
    const slice =
      range === "1D"
        ? chartData.slice(-2)
        : range === "1W"
          ? chartData.slice(-7)
          : chartData;
    return slice.length > 0 ? slice : chartData;
  }, [chartData, range]);

  const growthLabel = useMemo(() => {
    if (data.length < 2) return "+0%";
    const first = data[0].value;
    const last = data[data.length - 1].value;
    const pct = ((last - first) / first) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
  }, [data]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Portfolio Growth</h2>
          <p className="mt-1 text-sm text-zinc-400">Performance over time</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ranges.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                range === r
                  ? "bg-green-500 text-black"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
          <span className="ml-1 rounded-xl bg-green-500/10 px-3 py-1.5 text-sm text-green-400">
            {growthLabel}
          </span>
        </div>
      </div>
      <ChartContainer className="h-[360px]" minHeight={360}>
        <AreaChart data={data}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="label" stroke="#71717a" />
            <YAxis stroke="#71717a" />
            <Tooltip
              contentStyle={{
                background: "#09090b",
                border: "1px solid #27272a",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#portfolioGradient)"
            />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
