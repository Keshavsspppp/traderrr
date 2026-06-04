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
import type { PortfolioHistoryPoint, PortfolioTimeRange } from "@/types/portfolio";
import ChartContainer from "@/components/charts/ChartContainer";

interface PortfolioChartProps {
  data: PortfolioHistoryPoint[];
  onTimeRangeChange?: (range: PortfolioTimeRange) => void;
}

const timeRanges: PortfolioTimeRange[] = ["1D", "1W", "1M"];

export function PortfolioChart({ data, onTimeRangeChange }: PortfolioChartProps) {
  const [selectedRange, setSelectedRange] = useState<PortfolioTimeRange>("1M");

  const handleRangeChange = (range: PortfolioTimeRange) => {
    setSelectedRange(range);
    onTimeRangeChange?.(range);
  };

  const chartData = useMemo(
    () =>
      data.map((point) => ({
        date: new Date(point.date).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
        value: point.value,
        pnl: point.pnl,
      })),
    [data]
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold">Portfolio Performance</h3>
          <p className="mt-1 text-sm text-zinc-400">Track growth over time</p>
        </div>
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => handleRangeChange(range)}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedRange === range
                  ? "bg-green-500 text-black"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <ChartContainer className="h-[360px]" minHeight={360}>
        <AreaChart data={chartData}>
            <defs>
              <linearGradient id="portfolioChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#71717a"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                background: "#09090b",
                border: "1px solid #27272a",
                borderRadius: "12px",
                color: "#fff",
              }}
              formatter={(value) =>
                value != null ? [`₹${Number(value).toLocaleString("en-IN")}`, "Value"] : ["—", "Value"]
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#portfolioChartGradient)"
            />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
