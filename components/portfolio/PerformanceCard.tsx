import { BarChart3, IndianRupee, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/format";

type Performance = {
  portfolioValue: number;
  investedAmount: number;
  totalProfit: number;
  roi: number;
};

export default function PerformanceCard({ performance }: { performance: Performance }) {
  const stats = [
    { title: "Portfolio Value", value: formatCurrency(performance.portfolioValue), icon: Wallet },
    { title: "Invested Amount", value: formatCurrency(performance.investedAmount), icon: IndianRupee },
    {
      title: "Total Profit",
      value: formatCurrency(performance.totalProfit),
      icon: TrendingUp,
      color: performance.totalProfit >= 0 ? "text-green-400" : "text-red-400",
    },
    { title: "Return", value: formatPercent(performance.roi), icon: BarChart3, color: "text-green-400" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <p className="text-zinc-400">{stat.title}</p>
            <stat.icon size={22} className="text-green-400" />
          </div>
          <h3 className={`mt-4 text-3xl font-bold ${stat.color ?? ""}`}>{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}
