"use client";

import { LineChart, Line } from "recharts";
import ChartContainer from "@/components/charts/ChartContainer";

const data = [
  { value: 10 },
  { value: 30 },
  { value: 22 },
  { value: 50 },
  { value: 40 },
  { value: 70 },
  { value: 90 },
];

export default function MarketChart() {
  return (
    <div className="h-full w-full opacity-20">
      <ChartContainer minHeight={288}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={4}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
