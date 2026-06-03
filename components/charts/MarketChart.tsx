"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

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
    <div className="absolute inset-0 opacity-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={4}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}