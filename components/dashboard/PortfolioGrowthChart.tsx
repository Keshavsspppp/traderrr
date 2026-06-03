"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", value: 100000 },
  { month: "Feb", value: 104500 },
  { month: "Mar", value: 107000 },
  { month: "Apr", value: 105500 },
  { month: "May", value: 115000 },
  { month: "Jun", value: 124560 },
];

export default function PortfolioGrowthChart() {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        backdrop-blur-xl
      "
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Portfolio Growth
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Last 6 months performance
          </p>
        </div>

        <div
          className="
            rounded-xl
            bg-green-500/10
            px-4
            py-2
            text-sm
            text-green-400
          "
        >
          +24.56%
        </div>
      </div>

      <div className="h-[380px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="portfolioGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#22c55e"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopColor="#22c55e"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
            />

            <XAxis
              dataKey="month"
              stroke="#71717a"
            />

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
        </ResponsiveContainer>
      </div>
    </div>
  );
}