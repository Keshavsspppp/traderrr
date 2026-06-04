"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";
import ChartContainer from "@/components/charts/ChartContainer";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4"];

export default function AllocationChart({
  allocation,
}: {
  allocation: { name: string; value: number }[];
}) {
  const data = allocation.length > 0 ? allocation : [{ name: "Cash", value: 100 }];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold">Asset Allocation</h2>
      <ChartContainer className="h-[300px]" minHeight={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartContainer>
      <div className="mt-4 space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.name}</span>
            </div>
            <span>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
